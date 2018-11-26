import React from 'react';
import { connect } from 'react-redux';

const HwBudgetView = (props) => {
  const { error, items, total } = props.budget;
  if (!error && !items) { return null; }

  // For code reviewer: this layout is temporary and will change for sure :-)
  return (
    <article>
      {error && <div>{error}</div>}
      {items && (
        <React.Fragment>
          <div>Your current HW budget: {total}</div>
          <table className="hw-budget">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {
                items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.date}</td>
                    <td>{item.action}</td>
                    <td>{item.amount}</td>
                    <td>
                      {
                        item.hw && (
                          <ul>
                            {
                              Object.keys(item.hw).map((elem, i) => (
                                (elem !== 'id') && (<li key={i}>{elem}: {item.hw[elem]}</li>)
                              ))
                            }
                          </ul>
                        )
                      }
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </React.Fragment>
      )}
    </article>
  );
};

const mapStateToProps = (state) => ({
  budget: state.budget,
});

export const HwBudget = connect(mapStateToProps)(HwBudgetView);
