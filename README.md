# Syncano Socket stripe-payments
[![CircleCI](https://circleci.com/gh/Syncano/syncano-socket-stripe-payments.svg?style=svg)](https://circleci.com/gh/Syncano/syncano-socket-stripe-payments)

Stripe offers payment solutions for businesses.

### Current Features
Execute the following processes with Stripe

| Process       | Actions      
| ------------- |----------
| Balance       | - Retrieve balance<br/>- Retrieve a balance Transactions<br/>- List all balance history
| Bank Account  | - Create a bank account<br/>- Retrieve a bank account<br/>-  Update a bank account<br/>- Verify a bank account<br/>- Delete a bank account<br/>- List all bank accounts
| Cards         | - Create a card<br/>- Retrieve a card<br/>- Update a card<br/>- Delete a card<br/>- List all cards
| Charge        | - Create a charge<br/>- Retrieve a charge<br/>- Update a charge<br/>- Capture a charge<br/>- List all charges
| Customers     | - Create a customer<br/>- Retrieve a customer<br/>- Update a customer<br/>- Delete a customer<br/>- List all customers
| Disputes      | - Retrieve a dispute<br/>- Update a dispute<br/>- Close a dispute<br/>- List all disputes
| Events        | - Retrieve an event<br/>- List all events
| Sources       | - Create a source<br/>- Retrieve a source<br/>- Update a source<br/>- Attach a source<br/>- Dettach a source
| Tokens        | - Create a card token<br/>- Create a bank account token<br/>- Create a PII token<br/>- Retrieve a token

For more information, kindly refer to [Stripe Payments API documentation](https://stripe.com/docs/api)

### Install

```
syncano-cli add stripe-payments
```


## Socket Documentation

To view socket endpoints and corresponding parameters, kindly, visit [here](https://syncano.io/#/sockets/stripe-payments)


### Contributing

#### How to Contribute
  * Fork this repository
  * Clone from your fork
  * Make your contributions (Make sure your work is well tested)
  * Create Pull request from the fork to this repo

#### Setting up environment variables
  * Create a `.envrc` on parent folder
  * Copy contents of `.envrc.default` file to newly created `.envrc` file and assign appropriate values to the listed variables.

#### Testing
  * Ensure all your test are written in the `test` directory
  * Use the command `npm test` to run test
