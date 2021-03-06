import { Staff } from "~/entity";
import { Role } from "~/entity/Role";
import { AppRoleEnum, RoleEnum } from "~/enums/RoleEnum";
import { UnauthorisedAccessedError } from "~/helpers/shortcuts";

export class RoleControllerFactory {
  getController(role: RoleEnum | AppRoleEnum): IRoleController {
    switch (role) {
      case RoleEnum.TA:
        return new TaRoleController();
      case RoleEnum.LECTURER:
        return new LecturerRoleController();
      case AppRoleEnum.ADMIN:
        return new AdminRoleController();
      default:
        throw new Error("Cannot create controller: invalid Role");
    }
  }
}

export interface IRoleController {
  getRolesByUnit(user: Staff, unitId: string): any;
  createRole(user: Staff, unitId: string, newRecord: Role): any;
  deleteRole(user: Staff, unitId: string, roleId: string): any;
  updateRole(user: Staff, unitId: string, changedRecord: Role): any;
}

/* TA role authorisation - NO ACCESS
 */

class TaRoleController implements IRoleController {
  deleteRole(user: Staff, unitId: string, roleId: string) {
    throw new UnauthorisedAccessedError("TA cannot delete role");
  }
  updateRole(user: Staff, unitId: string, changedRecord: Role) {
    throw new UnauthorisedAccessedError("TA cannot update role");
  }
  createRole(user: Staff, unitId: string, newRecord: Role) {
    throw new UnauthorisedAccessedError("TA cannot create role");
  }
  getRolesByUnit(user: Staff, unitId: string) {
    throw new UnauthorisedAccessedError("TA cannot get roles by unit");
  }
}

/* Lecturer role authorisation - RESTRICTED ACCESS
 * - updateRole (for units they are lecturing)
 */

class LecturerRoleController implements IRoleController {
  deleteRole(user: Staff, unitId: string, roleId: string) {
    return Role.delete({ id: roleId });
  }
  async updateRole(user: Staff, unitId: string, changedRecord: Role) {
    let roleToUpdate = await Role.findOneOrFail({
      staffId: changedRecord.staffId,
      unitId: unitId,
    });
    return Role.update({ id: roleToUpdate.id }, changedRecord);
  }
  createRole(user: Staff, unitId: string, newRecord: Role) {
    return Role.save(Role.create(newRecord));
  }
  getRolesByUnit(user: Staff, unitId: string) {
    return Role.find({ unitId });
  }
}

/* Admin/workforce role authorisation - FULL ACCESS
 * - getRolesByUnit
 * - createRole
 * - deleteRole
 * - updateRole
 */

class AdminRoleController implements IRoleController {
  deleteRole(user: Staff, unitId: string, roleId: string) {
    return Role.delete({ id: roleId });
  }
  async updateRole(user: Staff, unitId: string, changedRecord: Role) {
    let roleToUpdate = await Role.findOneOrFail({
      staffId: changedRecord.staffId,
      unitId: unitId,
    });
    return Role.update({ id: roleToUpdate.id }, changedRecord);
  }
  createRole(user: Staff, unitId: string, newRecord: Role) {
    return Role.save(Role.create(newRecord));
  }
  getRolesByUnit(user: Staff, unitId: string) {
    return Role.find({ unitId });
  }
}
