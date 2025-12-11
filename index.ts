import { env } from '@/config/env';

import { createApp } from '@/app';

const app = createApp();

app.listen(env.server.port, () => {
  console.log(`✅ Server running on http://localhost:${env.server.port}`);
  console.log(`📝 Environment: ${env.server.nodeEnv}`);
});