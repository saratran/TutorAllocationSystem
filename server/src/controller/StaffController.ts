import { RoleEnum } from "~/enums/RoleEnum";

export class StaffControllerFactory {
  getController(role: RoleEnum): IStaffController {
    switch (role) {
      case RoleEnum.TA:
        return new TaStaffController();
      case RoleEnum.LECTURER:
        return new LecturerStaffController();
      case RoleEnum.ADMIN:
        return new AdminStaffController();
      default:
        throw new Error("Cannot create controller: invalid Role");
    }
  }
}

export interface IStaffController {}

class TaStaffController implements IStaffController {}

class LecturerStaffController implements IStaffController {}

class AdminStaffController implements IStaffController {}
