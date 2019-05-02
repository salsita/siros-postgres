# Admin scripts

Here you can find command-line scripts for Siros administration tasks:
* `siros-user`: create and update (system and real) users,
* `siros-show-budget`: show budget for individual users,
* `siros-update-budgets`: update budgets with initial and yearly increments,
* `siros-edu`: manage education expenses,
* `siros-hw`: create and update hw items,
* `siros-protocol`: generate PDF documents for hand-over and sell events,
* `siros-hw-repair`: account transactions for hw item repairs,
* `siros-hw-transfer`: change owner of hw items and update budgets accordingly,
* `siros-hw-sell`: remove hw items from active evidence after selling them outside Salsita,
* `siros-show-hw-marketplace`: show list of hw items available on markeplace,
* `siros-hw-discard`: discard hw items.

For easy reading, the source code of the scripts are not optimized for code-sharing, many parts are copy-pasted.

The scripts are developed on/for MacOS only (but it turns out they also run on Windows as well).

## `.env` file

The connection string of the DB needs to be provided in `bin/` directory here in `.env` file.
The format of the connection string in the file is
`DATABASE_URL="postgres://siros:<password>@<dns-name>:5432/siros"`.

## System user

First user you create with `bin/siros-hw` is the system user which is used as the owner of all newly created hw. You can
use another user as well, just update the `config.hwItems.systemUserId` accordingly. Make sure this user exists before
you create new hw with `bin/siros-hw`.

## Adjusting output width to your terminal size

To make sure the tables printed out to the output look nice, you may need to adjust the width of the tables to match
your terminal size. This can be done using `config.hwDisplay.descriptionWidth` and `config.hwDisplay.commentWidth`
values in `lib/config.js` file. Both represent the maximum number of characters printed into these two columns.

## Initial / yearly budget amounts

The amounts used by `siros-update-budgets` script are configured in `lib/config.js` file in `config.budget`
section. These are in CZK.

## Formula for price aging

The price-aging formula is also described in `lib/config.js`. In order to make this as flexible as possible, the
configuration file contains the actual function (code) that calculates the aged price based on 3 inputs:
* purchase price,
* purchase date, and
* the date against which the aged price is calculated (= today in most of the cases).

The initial implementation cuts off 20% right after the purchase and stays at that level for the first year.
Then it linearly descreases the remaining price so it reaches 5% of the purchase price after 5 years.

## PDF output directory

Make sure that the PDF output directory, specified as `config.pdf.outputDir` in `lib/config.js` exists and you have
write permission there before attempting to generate a PDF protocol. The path is relative to the `bin/` files.
