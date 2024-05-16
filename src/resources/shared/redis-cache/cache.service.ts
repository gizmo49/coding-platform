import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async get(key: string) {
    return await this.cacheManager.get(key);
  }

  public async setTicketSubscribers(ticketId: string, userId) {
    let value;
    const data: any = await this.get(ticketId);
    if (data === null) {
      value = {
        userId: [userId],
      };
    } else {
      value = {
        userId: [...new Set([...data.userId, userId])],
      };
    }
    await this.cacheManager.set(ticketId, value);
  }

  public async saveWorkspaceAGent(workspaceId: string, agentId: string) {
    let value = {};
    const workspace: any = await this.get(workspaceId);
    if (workspace === null) {
      value = {
        agentId: [agentId],
      };
    } else {
      value = {
        agentId: [...new Set([...workspace.agentId, agentId])],
      };
    }
    await this.cacheManager.set(workspaceId, value);
  }

  public async del(key: any) {
    await this.cacheManager.del(key);
  }

  public async getTicketUsers(ticketId: string) {
    const data: any = await this.get(ticketId);
    if (data === null) {
      return [];
    }
    return data.userId;
  }
  public async getWorkspaceAgents(workspaceId: string) {
    const data: any = await this.get(workspaceId);
    if (data === null) {
      return [];
    }
    return data.agentId;
  }
}
