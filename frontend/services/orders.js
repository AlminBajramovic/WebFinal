var OrdersService = {
    init: function() {
        console.log("Loading orders data...");
        this.load_orders();
    },
    
    load_orders: function() {
        RestClient.get("/orders/report", function(data) {
            console.log("Got orders data:", data);
            OrdersService.initialize_orders_table(data);
        });
    },
    
    initialize_orders_table: function(orders) {
        // Clear existing table body
        var tbody = $("#order-details tbody");
        tbody.empty();
        
        // Add each order as a row
        orders.forEach(function(order) {
            var row = `
                <tr>
                    <td class="text-center">
                        <button
                            type="button"
                            class="btn btn-success"
                            onclick="OrdersService.show_order_details(${order.orderNumber})"
                        >
                            Details
                        </button>
                    </td>
                    <td>${order.orderNumber}</td>
                    <td>${parseFloat(order.orderTotal).toFixed(2)}</td>
                </tr>
            `;
            tbody.append(row);
        });
        
        // Initialize DataTables for pagination, search, and ordering
        $('#order-details').DataTable({
            "pageLength": 10,
            "searching": true,
            "ordering": true,
            "paging": true,
            "info": true,
            "order": [[ 1, "desc" ]], // Order by order number descending
            "columnDefs": [
                { "orderable": false, "targets": 0 } // Disable ordering on Details column
            ]
        });
    },
    
    show_order_details: function(order_id) {
        console.log("Fetching order details for order:", order_id);
        
        // a. fetch the order details with clicked id from database (backend)
        RestClient.get("/order/details/" + order_id, function(orderDetails) {
            console.log("Got order details:", orderDetails);
            
            // b. populate the modal with data returned from the backend
            OrdersService.populate_order_details_modal(orderDetails);
            
            // Show the modal
            $('#order-details-modal').modal('show');
        }, function(error) {
            console.log("Error fetching order details:", error);
            alert("Error fetching order details: " + (error.message || "Unknown error"));
        });
    },
    
    populate_order_details_modal: function(orderDetails) {
        // Update modal title with order number
        $('#order-details-label').text('Order Details - Order #' + orderDetails[0].orderNumber);
        
        // Clear existing table body
        var tbody = $("#order-details-modal tbody");
        tbody.empty();
        
        var totalBill = 0;
        
        // Add each product as a row
        orderDetails.forEach(function(item, index) {
            var lineTotal = parseFloat(item.quantityOrdered) * parseFloat(item.priceEach);
            totalBill += lineTotal;
            
            var row = `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${item.productName}</td>
                    <td>${item.quantityOrdered}</td>
                    <td>${parseFloat(item.priceEach).toFixed(2)}</td>
                </tr>
            `;
            tbody.append(row);
        });
        
        // Add total row
        var totalRow = `
            <tr>
                <td colspan="3"><strong>Total bill</strong></td>
                <td><strong>${totalBill.toFixed(2)}</strong></td>
            </tr>
        `;
        tbody.append(totalRow);
    }
}
