import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { test } from 'node:test';

test('the inherited backup exclusion does not remove Core runtime source from Git deployments', () => {
  for (const path of ['app/api/cron/backup/route.ts', 'core/lib/backup/sql-dump.ts']) {
    assert(existsSync(path), `Missing runtime source: ${path}`);
    const ignored=spawnSync('git',['check-ignore','--no-index','--quiet',path],{encoding:'utf8',windowsHide:true});
    assert.equal(ignored.status,1, `Runtime source must not be excluded from release: ${path}`);
  }
});
