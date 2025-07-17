var EmployeesService = {
    init: function() {
        console.log("Loading employees performance data...");
        this.load_employees_performance();
    },
    
    load_employees_performance: function() {
        RestClient.get("/employees/performance", function(data) {
            console.log("Got employee data:", data);
            EmployeesService.populate_employee_table(data);
        });
    },
    
    populate_employee_table: function(employees) {
        var tbody = $("#employee-performance tbody");
        tbody.empty(); // Clear existing rows
        
        employees.forEach(function(employee) {
            var row = `
                <tr>
                    <td class="text-center">
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-warning" onclick="EmployeesService.edit_employee(${employee.employeeNumber})">
                                Edit
                            </button>
                            <button type="button" class="btn btn-danger" onclick="EmployeesService.delete_employee(${employee.employeeNumber})">
                                Delete
                            </button>
                        </div>
                    </td>
                    <td>${employee.full_name}</td>
                    <td>${employee.email}</td>
                    <td>${employee.total}</td>
                </tr>
            `;
            tbody.append(row);
        });
    },
    
    delete_employee: function(employee_id) {
        if (
          confirm(
            "Do you want to delete employee with the id " + employee_id + "?"
          ) == true
        ) {
          console.log("Deleting employee with id:", employee_id);
          
          RestClient.delete("/employee/delete", {employeeNumber: employee_id}, function(response) {
              console.log("Employee deleted successfully:", response);
              alert("Employee deleted successfully!");
              // Reload the table to show updated data
              EmployeesService.load_employees_performance();
          }, function(error) {
              console.log("Error deleting employee:", error);
              alert("Error deleting employee: " + (error.message || "Unknown error"));
          });
        }
    },
    edit_employee: function(employee_id){
        console.log("Get employee with provided id, open modal and populate modal fields with data returned from the database");
        alert("Opened");
    }
}