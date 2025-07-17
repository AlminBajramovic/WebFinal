<?php

class ExamDao
{

  private $conn;

  /**
   * constructor of dao class
   */
  public function __construct()
  {
    try {
      /** TODO
       * List parameters such as servername, username, password, schema. Make sure to use appropriate port
       */
      $servername='localhost';
      $username='root';
      $password='GasiBever';
      $schema='web-final';
      $port=3306;

      /** TODO
       * Create new connection
       */
      $this->conn = new PDO("mysql:host=$servername;dbname=$schema;port=$port", $username, $password);
      $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      echo "Connected successfully";
    } catch (PDOException $e) {
      echo "Connemployees_performance_reportection failed: " . $e->getMessage();
    }
  }

  /** TODO
   * Implement DAO method used to get employees performance report
   */
  public function employees_performance_report() {
    $query="SELECT 
    e.employeeNumber,CONCAT(e.firstName,' ',e.lastName)as full_name,e.email,SUM(p.amount) as total
    FROM employees e
    join customers c on e.employeeNumber=c.salesRepEmployeeNumber
    join payments p on c.customerNumber=p.customerNumber
    group by e.employeeNumber";
    $stmt=$this->conn->prepare($query);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  /** TODO
   * Implement DAO method used to delete employee by id
   */
  public function delete_employee($employee_id) {
    $query = "DELETE FROM employees WHERE employeeNumber = :employee_id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute(['employee_id' => $employee_id]);
        return $stmt->rowCount();
  }

  /** TODO
   * Implement DAO method used to edit employee data
   */
  public function edit_employee($employee_id, $data) {
    $query = "UPDATE employees 
                  SET firstName = :firstName, lastName = :lastName, extension=:extension, email=:email,
                  officeCode=:officeCode,jobTitle=:jobTitle
                  WHERE employeeNumber = :employee_id";
        $stmt = $this->conn->prepare($query);
        $data['employee_id'] = $employee_id;
        $stmt->execute($data);
        return $stmt->rowCount();
  }

  /** TODO
   * Implement DAO method used to get orders report
   */
  public function get_orders_report() {
     $query = "SELECT 
        o.orderNumber,
        o.orderDate,
        o.status,
        c.customerName,
        c.city,
        c.country,
        COUNT(od.productCode) AS totalProducts,
        SUM(od.quantityOrdered * od.priceEach) AS orderTotal
    FROM orders o
    JOIN customers c ON o.customerNumber = c.customerNumber
    JOIN orderdetails od ON o.orderNumber = od.orderNumber
    GROUP BY o.orderNumber, o.orderDate, o.status, c.customerName, c.city, c.country
    ORDER BY o.orderDate DESC";
    
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Add HTML details field for each order
    foreach ($orders as &$order) {
        $order['details'] = '<button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#order-details-modal" data-bs-id="@' . $order['orderNumber'] . '">Details</button>';
        $order['order_number'] = $order['orderNumber'];
        $order['total_amount'] = $order['orderTotal'];
    }
    
    return $orders;
  }

  /** TODO
   * Implement DAO method used to get all products in a single order
   */
  public function get_order_details($order_id) {
     $query = "SELECT 
        p.productCode,
        p.productName,
        p.productLine,
        od.quantityOrdered,
        od.priceEach,
        (od.quantityOrdered * od.priceEach) AS lineTotal
    FROM orderdetails od
    JOIN products p ON od.productCode = p.productCode
    WHERE od.orderNumber = :order_id
    ORDER BY od.orderLineNumber";
    
    $stmt = $this->conn->prepare($query);
    $stmt->execute(['order_id' => $order_id]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
}
