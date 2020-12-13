import { DeleteResult, getRepository } from "typeorm";
import {
  DELETE,
  GET,
  PATCH,
  Path,
  PathParam,
  POST,
  PUT,
} from "typescript-rest";
import { Rule } from "../entity/Rule";

@Path("/rules")
class RulesService {
  repo = getRepository(Rule);

  /**
   * Returns a list of the global rules
   * @return Array<Rule>: rules list
   */
  @GET
  public getAllRules(): Promise<Array<Rule>> {
    return this.repo.find();
  }

  /**
   * Returns a rule
   * @param id id for the rule
   * @return Rule single rule
   */
  // TODO: assert return value as Promise<Rule> here
  @GET
  @Path(":id")
  public getRule(@PathParam("id") id: number) {
    return this.repo.findOne({
      id: id,
    });
  }
  /**
   * Updates a global rule
   * @param changedRule new Rule object to change existing Rule to
   * @return Rule: changed global rule
   */
  @PUT
  public async updateRule(changedRule: Rule): Promise<Rule> {
    let ruleToUpdate = await this.repo.findOne({
      id: changedRule.id,
    });
    ruleToUpdate = changedRule;
    return this.repo.save(ruleToUpdate);
  }
}
