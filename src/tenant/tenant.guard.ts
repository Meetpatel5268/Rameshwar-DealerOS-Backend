import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    const user = request.user;
    
    if (!user) {
      return true; // Delegate to AuthGuard for unauthenticated users
    }
    
    // If the user is a super admin, they can access any tenant (provided via header)
    if (user.roles?.includes('SUPER_ADMIN')) {
      return true;
    }
    
    // The target tenant the user is trying to access
    const targetDealerId = request.headers['x-dealer-id'] || user.dealerId;

    if (!user.dealerId || user.dealerId !== targetDealerId) {
       throw new ForbiddenException('Access to this dealer data is forbidden.');
    }
    
    // Inject validated dealerId into request for downstream use (like Prisma multitenancy)
    request.dealerId = user.dealerId;
    
    return true;
  }
}
