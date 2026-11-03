import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Docker Compose security configuration', () => {
  const compose = readFileSync(resolve(process.cwd(), 'docker-compose.yml'), 'utf8');
  const envExample = readFileSync(resolve(process.cwd(), '.env.example'), 'utf8');
  const databaseService = compose.match(/  db:\r?\n([\s\S]*?)(?=\r?\n  api:)/)?.[1];

  it('binds the API port to the local machine only', () => {
    expect(compose).toContain('"127.0.0.1:3000:3000"');
  });

  it('does not publish the database port on the host', () => {
    expect(databaseService).toBeDefined();
    expect(databaseService).not.toMatch(/^\s+ports:/m);
  });

  it('requires deployment-specific database credentials', () => {
    expect(compose).toContain('${MYSQL_ROOT_PASSWORD:?');
    expect(compose).toContain('${MYSQL_PASSWORD:?');
    expect(compose).not.toContain(':-rootpassword');
    expect(compose).not.toContain(':-quimiport_pass');
    expect(envExample).toMatch(/^MYSQL_ROOT_PASSWORD=$/m);
    expect(envExample).toMatch(/^MYSQL_PASSWORD=$/m);
    expect(envExample).toContain('REPLACE_WITH_UNIQUE_URL_ENCODED_PASSWORD');
  });
});
