import { Component } from '@angular/core';
import { CustomersService } from '../services/customers.service';

import Chart from "chart.js/auto";


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent {
  tableOfCustomers: any[] = [];
  tableOfTransactions: any[] = [];
  customersAndTransactions: any[] = [];
  dateOftransactions:any;
  searchKey: string = '';

 // newSearchKey=this.searchKey.split(" ").join("")

 customerTransactionAmounts: { [key: number]: number } = {};
 selectedFilter:string='';
  newChart: any = null;
  constructor(private _CustomerService: CustomersService) {}

  ngOnInit(): void {
    this.onGetCustomersData();
    this.onGetTransactionData();
  }

  onGetCustomersData() {
    let params = {
      name: this.searchKey,
    };

    this._CustomerService.getAllCustomers(params).subscribe({
      next: (res) => {
        console.log(' Data:', res);
        this.tableOfCustomers = res;
          this.checkDataAndCombine();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onGetTransactionData() {
    this._CustomerService.getAllTransactions().subscribe({
      next: (res) => {
        console.log('Transactions Data:', res);
        this.tableOfTransactions = res;
      this.checkDataAndCombine();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  checkDataAndCombine() {
    if (this.tableOfCustomers.length > 0 && this.tableOfTransactions.length > 0) {
      this.combineCustomerTransactionData();
    }
  }

  combineCustomerTransactionData() {
    this.customerTransactionAmounts = this.tableOfCustomers.reduce((acc, customer) => {
      const totalAmount = this.tableOfTransactions.filter(transaction => transaction.customer_id === +customer.id)
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      acc[customer.id] = totalAmount;
      return acc;
    }, {} as { [key: number]: number });

    this.customersAndTransactions = this.tableOfCustomers.map(customer => ({
      ...customer,
      totalAmount: this.customerTransactionAmounts[customer.id] || 0 ,
      dateOftransactions :this.tableOfTransactions
  

    }));
   this.customersChart();
  }

  customersChart() {
    const customerNames = this.customersAndTransactions.map(c => c.name);
    const transactionAmounts = this.customersAndTransactions.map(c => c.totalAmount);

    if (this.newChart) {
      this.newChart.destroy();
    }

    this.newChart = new Chart('customerChart', {
      type: 'bar', //line
      data: {
        labels: customerNames,
        datasets: [{
          label: 'Total Amount',
          data: transactionAmounts,
          backgroundColor: 'rgba(103, 151, 219, 0.5)',
          borderColor: 'rgba(103, 151, 219, 1)',
          borderWidth: 1,
        
          // fill: true
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        responsive: true,
  
      }
    });
  }
  chartPerCustomer(){
    this.customerChart()
  }

  customerChart() {
    // const customerNames = this.customersAndTransactions.map(c => c.name);
    // const transactionAmounts = this.customersAndTransactions.map(c => c.amount);
    // const transactionPerDay= this.customersAndTransactions.map(c => c.date);

    // if (this.newChart) {
    //   this.newChart.destroy();
    // }

    // this.newChart = new Chart('customerChartPerDay', {
    //   type: 'bar',
    //   data: {
    //     labels: transactionPerDay ,
    //     datasets: [{
    //       label: ' Amount per Day',
    //       data: transactionAmounts,
    //       backgroundColor: 'rgba(103, 151, 219, 0.5)',
    //       borderColor: 'rgba(103, 151, 219, 1)',
    //       borderWidth: 1,
    //       // fill: true
    //     }]
    //   },
    //   options: {
    //     scales: {
    //       y: {
    //         beginAtZero: true
    //       }
    //     },
    //     responsive: true,
  
    //   }
    // });
  }




}
