import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID, TASKS_ID } from '@/config';
import { getMember } from '@/features/members/utils';
import { MemberRole } from '@/features/members/types';
import { sessionMiddleware } from '@/lib/session-middleware';
import { zValidator } from '@hono/zod-validator';
import { endOfMonth, startOfMonth, subMonths } from 'date-fns';
import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import z from 'zod';
import { createProjectSchema, updateProjectSchema } from '../schemas';
import { Project } from '../types';
import { TaskStatus } from '@/features/tasks/types';

const app = new Hono()
  .post(
    '/',
    sessionMiddleware,
    zValidator('form', createProjectSchema),
    async (c) => {
      const databases = c.get('databases');
      const user = c.get('user');
      const storage = c.get('storage');

      const { name, image, workspaceId } = c.req.valid('form');

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json(
          {
            error: 'Unauthorized',
          },
          401,
        );
      }

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image,
        );

        const arrayBuffer = await storage.getFileDownload(
          IMAGES_BUCKET_ID,
          file.$id,
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer,
        ).toString('base64')}`;
      }

      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name,
          imageUrl: uploadedImageUrl,
          workspaceId,
        },
      );

      return c.json({ data: project });
    },
  )

  .get(
    '/',
    sessionMiddleware,
    zValidator('query', z.object({ workspaceId: z.string() })),
    async (c) => {
      const user = c.get('user');
      const databases = c.get('databases');

      const { workspaceId } = c.req.valid('query');

      if (!workspaceId) {
        return c.json({ error: 'Missing WorkspaceId' }, 400);
      }

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        [
          Query.equal('workspaceId', workspaceId),
          Query.orderDesc('$createdAt'),
        ],
      );
      return c.json({
        data: projects,
      });
    },
  )

  .get('/:projectId', sessionMiddleware, async (c) => {
    const user = c.get('user');
    const databases = c.get('databases');
    const { projectId } = c.req.param();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId,
    );

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    return c.json({ data: project });
  })

  .patch(
    '/:projectId',
    sessionMiddleware,
    zValidator('form', updateProjectSchema),
    async (c) => {
      const databases = c.get('databases');
      const storage = c.get('storage');
      const user = c.get('user');

      const { projectId } = c.req.param();
      const { name, image } = c.req.valid('form');

      const existingProject = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
      );

      const member = await getMember({
        databases,
        workspaceId: existingProject.workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json(
          {
            error: 'Unauthorized',
          },
          401,
        );
      }

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image,
        );

        const arrayBuffer = await storage.getFileView(
          IMAGES_BUCKET_ID,
          file.$id,
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer,
        ).toString('base64')}`;
      } else {
        uploadedImageUrl =
          typeof image === 'string' &&
          image !== 'undefined' &&
          image !== 'null' &&
          image !== ''
            ? image
            : undefined;
      }

      const project = await databases.updateDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
        {
          name,
          imageUrl: uploadedImageUrl,
        },
      );
      return c.json({ data: project });
    },
  )

  .delete('/:projectId', sessionMiddleware, async (c) => {
    const databases = c.get('databases');
    const user = c.get('user');

    const { projectId } = c.req.param();

    const existingProject = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId,
    );

    const member = await getMember({
      databases,
      workspaceId: existingProject.workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

    return c.json({
      data: {
        $id: existingProject.$id,
      },
    });
  })

  .get('/:projectId/analytics', sessionMiddleware, async (c) => {
    const databases = c.get('databases');
    const user = c.get('user');
    const { projectId } = c.req.param();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId,
    );

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const [
      allTasks,
      thisMonthTasks,
      lastMonthTasks,
      allAssignedTasks,
      thisMonthAssignedTasks,
      lastMonthAssignedTasks,
      allIncompleteTasks,
      thisMonthIncompleteTasks,
      lastMonthIncompleteTasks,
      allCompletedTasks,
      thisMonthCompletedTasks,
      lastMonthCompletedTasks,
      allOverdueTasks,
      thisMonthOverdueTasks,
      lastMonthOverdueTasks,
    ] = await Promise.all([
      // 1. Total tasks
      databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal('projectId', projectId),
      ]),
      databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal('projectId', projectId),
        Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
      ]),
      databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal('projectId', projectId),
        Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
      ]),

      // 2. Assigned tasks
      databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal('projectId', projectId),
        Query.equal('assigneeId', member.$id),
      ]),
      databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal('projectId', projectId),
        Query.equal('assigneeId', member.$id),
        Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
      ]),
      databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal('projectId', projectId),
        Query.equal('assigneeId', member.$id),
        Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
      ]),

      // 3. Incomplete tasks
      databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal('projectId', projectId),
        Query.notEqual('status', TaskStatus.DONE),
      ]),
      databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal('projectId', projectId),
        Query.notEqual('status', TaskStatus.DONE),
        Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
      ]),
      databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal('projectId', projectId),
        Query.notEqual('status', TaskStatus.DONE),
        Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
      ]),

      // 4. Completed tasks
      databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal('projectId', projectId),
        Query.equal('status', TaskStatus.DONE),
      ]),
      databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal('projectId', projectId),
        Query.equal('status', TaskStatus.DONE),
        Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
      ]),
      databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal('projectId', projectId),
        Query.equal('status', TaskStatus.DONE),
        Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
      ]),

      // 5. Overdue tasks
      databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal('projectId', projectId),
        Query.notEqual('status', TaskStatus.DONE),
        Query.lessThan('dueDate', now.toISOString()),
      ]),
      databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal('projectId', projectId),
        Query.notEqual('status', TaskStatus.DONE),
        Query.lessThan('dueDate', now.toISOString()),
        Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
      ]),
      databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal('projectId', projectId),
        Query.notEqual('status', TaskStatus.DONE),
        Query.lessThan('dueDate', now.toISOString()),
        Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
      ]),
    ]);

    const taskCount = allTasks.total;
    const taskDifference = thisMonthTasks.total - lastMonthTasks.total;

    const assignedTaskCount = allAssignedTasks.total;
    const assignedTaskDifference =
      thisMonthAssignedTasks.total - lastMonthAssignedTasks.total;

    const incompleteTaskCount = allIncompleteTasks.total;
    const incompleteTaskDifference =
      thisMonthIncompleteTasks.total - lastMonthIncompleteTasks.total;

    const completeTaskCount = allCompletedTasks.total;
    const completeTaskDifference =
      thisMonthCompletedTasks.total - lastMonthCompletedTasks.total;

    const overdueTaskCount = allOverdueTasks.total;
    const overdueTaskDifference =
      thisMonthOverdueTasks.total - lastMonthOverdueTasks.total;

    return c.json({
      data: {
        taskCount,
        taskDifference,
        assignedTaskCount,
        assignedTaskDifference,
        completeTaskCount,
        completeTaskDifference,
        incompleteTaskCount,
        incompleteTaskDifference,
        overdueTaskCount,
        overdueTaskDifference,
      },
    });
  });

export default app;
