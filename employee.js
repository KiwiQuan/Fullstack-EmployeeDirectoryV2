import express from "express";
import { employees, addEmployee } from "#db/employees";
const employeeRouter = express.Router();

employeeRouter
  .route("/")
  .get((req, res) => {
    res.send(employees);
  })
  .post((req, res, next) => {
    try {
      if (!req.body) {
        res.status(400).send("Request must have a body!");
      } else if (!req.body.name) {
        res.status(400).send("New employee must have a name!");
      } else {
        const employee = addEmployee(req.body.name);
        res.status(201).send(employee);
      }
    } catch (err) {
      next(err);
    }
  });

// Note: this middleware has to come first! Otherwise, Express will treat
// "random" as the argument to the `id` parameter of /employees/:id.
employeeRouter.route("/random").get((req, res) => {
  const randomIndex = Math.floor(Math.random() * employees.length);
  res.send(employees[randomIndex]);
});

employeeRouter.route("/:id").get((req, res) => {
  const { id } = req.params;

  // req.params are always strings, so we need to convert `id` into a number
  // before we can use it to find the employee
  const employee = employees.find((e) => e.id === +id);

  if (!employee) {
    return res.status(404).send("Employee not found");
  }

  res.send(employee);
});

export default employeeRouter;
