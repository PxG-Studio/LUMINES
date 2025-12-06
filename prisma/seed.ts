/**
 * Database Seed Script
 * Populates database with initial data for development
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test user
  const user = await prisma.user.upsert({
    where: { email: 'dev@lumenforge.io' },
    update: {},
    create: {
      email: 'dev@lumenforge.io',
      name: 'Development User',
      roles: ['user', 'admin'],
      nocturnaId: 'dev-nocturna-id',
      jwtSubject: 'dev-jwt-subject',
    },
  });

  console.log('✅ Created user:', user.email);

  // Create sample project
  const project = await prisma.project.upsert({
    where: { slug: 'sample-unity-project' },
    update: {},
    create: {
      name: 'Sample Unity Project',
      slug: 'sample-unity-project',
      description: 'A sample Unity project for testing',
      engine: 'unity',
      platform: 'webgl',
      userId: user.id,
    },
  });

  console.log('✅ Created project:', project.name);

  // Create sample template
  const template = await prisma.template.upsert({
    where: { slug: 'unity-basic' },
    update: {},
    create: {
      name: 'Unity Basic Template',
      slug: 'unity-basic',
      description: 'A basic Unity project template',
      engine: 'unity',
      category: 'starter',
      structure: {
        files: [
          { path: 'Assets/Main.cs', content: '// Main script' },
          { path: 'Assets/README.md', content: '# Unity Project' },
        ],
      },
    },
  });

  console.log('✅ Created template:', template.name);

  // Create sample component (SPARK)
  const component = await prisma.component.create({
    data: {
      name: 'SampleComponent',
      type: 'script',
      content: 'public class SampleComponent : MonoBehaviour {\n  void Start() {\n    Debug.Log("Hello from SPARK!");\n  }\n}',
      language: 'csharp',
      userId: user.id,
      projectId: project.id,
      prompt: 'Create a simple Unity component',
      model: 'gpt-4',
      experts: ['logic'],
      generationId: 'spark-gen-123',
    },
  });

  console.log('✅ Created component:', component.name);

  // Create sample design tokens (SLATE)
  const tokens = [
    { name: 'primary', category: 'color', value: '#6366F1', group: 'brand' },
    { name: 'secondary', category: 'color', value: '#8B5CF6', group: 'brand' },
    { name: 'spacing-xs', category: 'spacing', value: '4px', group: 'scale' },
    { name: 'spacing-sm', category: 'spacing', value: '8px', group: 'scale' },
    { name: 'spacing-md', category: 'spacing', value: '16px', group: 'scale' },
    { name: 'font-sans', category: 'typography', value: 'Inter, sans-serif', group: 'fonts' },
  ];

  for (const token of tokens) {
    await prisma.designToken.upsert({
      where: {
        name_category: {
          name: token.name,
          category: token.category,
        },
      },
      update: {},
      create: token,
    });
  }

  console.log(`✅ Created ${tokens.length} design tokens`);

  // Create sample build (IGNIS)
  const build = await prisma.build.create({
    data: {
      projectId: project.id,
      userId: user.id,
      target: 'webgl',
      configuration: 'development',
      status: 'completed',
      progress: 100,
      artifactUrl: 'https://example.com/builds/sample-build.zip',
      artifactSize: BigInt(1024000), // 1MB
      buildLog: 'Build completed successfully',
      startedAt: new Date(Date.now() - 60000),
      completedAt: new Date(),
    },
  });

  console.log('✅ Created build:', build.id);

  // Create sample deployment (WAYPOINT)
  const deployment = await prisma.deployment.create({
    data: {
      projectId: project.id,
      userId: user.id,
      buildId: build.id,
      environment: 'staging',
      url: 'https://staging.example.com/projects/sample-unity-project',
      status: 'live',
      version: '1.0.0',
      deployedAt: new Date(),
    },
  });

  console.log('✅ Created deployment:', deployment.id);

  // Create sample events (for testing event system)
  await prisma.event.createMany({
    data: [
      {
        type: 'component.created',
        subsystem: 'spark',
        userId: user.id,
        projectId: project.id,
        componentId: component.id,
        payload: {
          componentName: component.name,
          componentType: component.type,
        },
      },
      {
        type: 'build.completed',
        subsystem: 'ignis',
        userId: user.id,
        projectId: project.id,
        buildId: build.id,
        payload: {
          buildStatus: 'completed',
          artifactUrl: build.artifactUrl,
        },
      },
      {
        type: 'deployment.completed',
        subsystem: 'waypoint',
        userId: user.id,
        projectId: project.id,
        deploymentId: deployment.id,
        payload: {
          deploymentUrl: deployment.url,
          environment: deployment.environment,
        },
      },
    ],
  });

  console.log('✅ Created sample events');

  console.log('✨ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

