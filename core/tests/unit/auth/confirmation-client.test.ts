import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const mocks=vi.hoisted(()=>({createBrowserClient:vi.fn((..._args: unknown[])=>({auth:{}}))}));
vi.mock('@supabase/ssr',()=>({createBrowserClient:mocks.createBrowserClient}));
import {createClient} from '@/core/lib/supabase/client';
beforeEach(()=>{vi.stubEnv('NEXT_PUBLIC_CORE_SUPABASE_URL','https://fixture.supabase.co');vi.stubEnv('NEXT_PUBLIC_CORE_SUPABASE_ANON_KEY','public-test-key')});
afterEach(()=>{vi.clearAllMocks();vi.unstubAllEnvs()});
describe('one-time auth confirmation client',()=>{
 it('leaves the one-time code to the explicit confirmation handler and avoids a cached automatic client',()=>{
  createClient({manualConfirmation:true});
  expect(mocks.createBrowserClient).toHaveBeenCalledWith(expect.anything(),expect.anything(),expect.objectContaining({isSingleton:false,auth:{detectSessionInUrl:false}}));
 });
 it('preserves the normal session client defaults elsewhere',()=>{
  createClient();
  const options=mocks.createBrowserClient.mock.calls[0]?.[2] as {isSingleton?:boolean;auth?:{detectSessionInUrl?:boolean}};
  expect(options?.isSingleton).not.toBe(false);
  expect(options?.auth?.detectSessionInUrl).not.toBe(false);
 });
});
