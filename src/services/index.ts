export { containerOrchestrator, ContainerOrchestrator } from './ContainerOrchestrator';
export { buildWorker, BuildWorker } from './BuildWorker';
export { assetProcessor, AssetProcessor } from './AssetProcessor';
export { logAggregator, LogAggregator } from './LogAggregator';
export { analytics, Analytics } from './Analytics';

export async function startAllServices(): Promise<void> {
  const { containerOrchestrator } = await import('./ContainerOrchestrator');
  const { buildWorker } = await import('./BuildWorker');
  const { assetProcessor } = await import('./AssetProcessor');
  const { logAggregator } = await import('./LogAggregator');
  const { analytics } = await import('./Analytics');

  await Promise.all([
    containerOrchestrator.start(),
    buildWorker.start(),
    assetProcessor.start(),
    logAggregator.start(),
    analytics.start(),
  ]);

  console.log('All services started successfully');
}

export async function stopAllServices(): Promise<void> {
  const { containerOrchestrator } = await import('./ContainerOrchestrator');
  const { buildWorker } = await import('./BuildWorker');
  const { assetProcessor } = await import('./AssetProcessor');
  const { logAggregator } = await import('./LogAggregator');
  const { analytics } = await import('./Analytics');

  await Promise.all([
    containerOrchestrator.stop(),
    buildWorker.stop(),
    assetProcessor.stop(),
    logAggregator.stop(),
    analytics.stop(),
  ]);

  console.log('All services stopped successfully');
}
