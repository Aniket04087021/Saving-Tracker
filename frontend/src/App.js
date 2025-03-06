import React, { useState, useEffect } from "react";

const SavingTracker = () => {
  const [savings, setSavings] = useState(0);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Mutual Fund");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Styles
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "30px 20px",
      fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh"
    },
    card: {
      width: "100%",
      maxWidth: "700px",
      textAlign: "center",
      border: "none",
      borderRadius: "16px",
      padding: "30px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      backgroundColor: "#ffffff"
    },
    header: {
      marginBottom: "25px",
      color: "#2c3e50"
    },
    title: {
      fontSize: "28px",
      fontWeight: "700",
      margin: "0 0 8px 0",
      color: "#2c3e50"
    },
    balanceContainer: {
      backgroundColor: "#e8f5e9",
      padding: "15px",
      borderRadius: "12px",
      marginBottom: "25px"
    },
    balanceLabel: {
      fontSize: "14px",
      color: "#388e3c",
      margin: "0 0 5px 0",
      fontWeight: "500"
    },
    balanceAmount: {
      fontSize: "32px",
      fontWeight: "700",
      margin: "0",
      color: "#2e7d32"
    },
    formGroup: {
      marginBottom: "25px"
    },
    inputContainer: {
      display: "flex",
      gap: "15px",
      marginBottom: "20px",
      flexWrap: "wrap"
    },
    inputWrapper: {
      flex: "1",
      minWidth: "200px"
    },
    inputLabel: {
      display: "block",
      textAlign: "left",
      marginBottom: "8px",
      fontSize: "14px",
      color: "#546e7a",
      fontWeight: "500"
    },
    input: {
      width: "100%",
      padding: "12px 15px",
      fontSize: "16px",
      border: "1px solid #cfd8dc",
      borderRadius: "8px",
      outline: "none",
      transition: "border-color 0.2s, box-shadow 0.2s"
    },
    inputFocus: {
      borderColor: "#4caf50",
      boxShadow: "0 0 0 3px rgba(76, 175, 80, 0.2)"
    },
    methodsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      marginTop: "15px",
      justifyContent: "center"
    },
    methodLabel: {
      position: "relative",
      padding: "10px 15px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      border: "1px solid #e0e0e0",
      transition: "all 0.2s"
    },
    methodInput: {
      position: "absolute",
      opacity: "0",
      width: "0",
      height: "0"
    },
    methodSelected: {
      backgroundColor: "#e8f5e9",
      borderColor: "#4caf50",
      color: "#2e7d32",
      fontWeight: "500"
    },
    button: {
      width: "100%",
      padding: "14px",
      backgroundColor: "#4caf50",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.2s",
      marginBottom: "25px"
    },
    buttonHover: {
      backgroundColor: "#43a047"
    },
    sectionTitle: {
      fontSize: "20px",
      fontWeight: "600",
      marginBottom: "15px",
      textAlign: "left",
      color: "#2c3e50"
    },
    tableContainer: {
      width: "100%",
      overflow: "auto",
      borderRadius: "8px",
      border: "1px solid #eceff1"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      textAlign: "left"
    },
    tableHeader: {
      backgroundColor: "#f5f7fa",
      color: "#546e7a",
      fontSize: "13px",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px"
    },
    th: {
      padding: "12px 15px",
      borderBottom: "1px solid #e0e0e0"
    },
    td: {
      padding: "12px 15px",
      borderBottom: "1px solid #eceff1",
      fontSize: "14px",
      color: "#455a64"
    },
    methodTag: {
      display: "inline-block",
      padding: "4px 8px",
      backgroundColor: "#e3f2fd",
      color: "#1976d2",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "500"
    },
    amountCell: {
      textAlign: "right",
      fontWeight: "500",
      color: "#388e3c"
    },
    noTransactions: {
      padding: "30px",
      textAlign: "center",
      color: "#90a4ae",
      backgroundColor: "#f5f7fa",
      borderRadius: "8px"
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
    },
    spinner: {
      borderRadius: "50%",
      width: "30px",
      height: "30px",
      border: "3px solid rgba(0, 0, 0, 0.1)",
      borderTopColor: "#4caf50",
      animation: "spin 1s linear infinite"
    },
    errorContainer: {
      maxWidth: "500px",
      margin: "50px auto",
      padding: "25px",
      backgroundColor: "#ffebee",
      color: "#c62828",
      borderRadius: "8px",
      textAlign: "center",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
    },
    errorTitle: {
      fontSize: "20px",
      fontWeight: "600",
      marginBottom: "15px"
    },
    trHover: {
      backgroundColor: "#f5f7fa"
    },
    alternateRow: {
      backgroundColor: "#fafafa"
    }
  };

  // Add this to your CSS or in the head of your HTML
  const spinnerAnimation = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  // Fetch transactions and balance on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch balance
        const balanceResponse = await fetch("https://saving-tracker.onrender.com/balance");
        if (!balanceResponse.ok) {
          throw new Error(`HTTP error! status: ${balanceResponse.status}`);
        }
        const balanceData = await balanceResponse.json();
        setSavings(balanceData.balance || 0);

        // Fetch transactions
        const transactionsResponse = await fetch("https://saving-tracker.onrender.com/transactions");
        if (!transactionsResponse.ok) {
          throw new Error(`HTTP error! status: ${transactionsResponse.status}`);
        }
        const transactionsData = await transactionsResponse.json();
        
        // Ensure transactions is an array, even if undefined
        setTransactions(Array.isArray(transactionsData.transactions) 
          ? transactionsData.transactions 
          : []
        );
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        
        // Check if it's a JSON parsing error
        if (error instanceof SyntaxError) {
          setError("Received invalid JSON response from server");
        } else {
          setError(error.message);
        }
        
        setSavings(0);
        setTransactions([]);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddSavings = async () => {
    if (!isNaN(amount) && amount !== "" && parseFloat(amount) > 0) {
      const parsedAmount = parseFloat(amount);
      
      try {
        const response = await fetch("https://saving-tracker.onrender.com/add-savings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: parsedAmount,
            method,
            description: description.trim() || method
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Safely handle potential undefined data
        setSavings(data.balance || 0);
        setTransactions(Array.isArray(data.transactions) ? data.transactions : []);

        // Reset input fields
        setAmount("");
        setDescription("");
      } catch (error) {
        console.error("Error adding savings:", error);
        
        // Check if it's a JSON parsing error
        if (error instanceof SyntaxError) {
          setError("Received invalid JSON response from server");
        } else { 
          setError(error.message);
        }
      }
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <style>{spinnerAnimation}</style>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h2 style={styles.errorTitle}>Error</h2>
        <p>{error}</p>
        <p style={{ fontSize: "14px", marginTop: "15px" }}>
          Please check your server connection and configuration.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Savings Tracker</h2>
        </div>
        
        <div style={styles.balanceContainer}>
          <p style={styles.balanceLabel}>Total Savings</p>
          <p style={styles.balanceAmount}>₹{savings.toFixed(2)}</p>
        </div>
        
        <div style={styles.formGroup}>
          <div style={styles.inputContainer}>
            <div style={styles.inputWrapper}>
              <label htmlFor="amount" style={styles.inputLabel}>
                Amount
              </label>
              <input 
                id="amount"
                type="number" 
                placeholder="Enter amount" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                style={styles.input}
                onFocus={(e) => e.target.style.boxShadow = styles.inputFocus.boxShadow}
                onBlur={(e) => e.target.style.boxShadow = "none"}
              />
            </div>
            
            <div style={styles.inputWrapper}>
              <label htmlFor="description" style={styles.inputLabel}>
                Description
              </label>
              <input 
                id="description"
                type="text" 
                placeholder="Description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                style={styles.input}
                onFocus={(e) => e.target.style.boxShadow = styles.inputFocus.boxShadow}
                onBlur={(e) => e.target.style.boxShadow = "none"}
              />
            </div>
          </div>
          
          <div>
            <label style={styles.inputLabel}>Saving Method</label>
            <div style={styles.methodsContainer}>
              {["Mutual Fund", "Stock", "Saving Account", "Cash"].map((opt) => (
                <label 
                  key={opt} 
                  style={{
                    ...styles.methodLabel,
                    ...(method === opt && styles.methodSelected)
                  }}
                >
                  <input 
                    type="radio" 
                    name="method" 
                    value={opt} 
                    checked={method === opt} 
                    onChange={(e) => setMethod(e.target.value)} 
                    style={styles.methodInput}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleAddSavings} 
          style={styles.button}
          onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
        >
          Add Savings
        </button>

        <h3 style={styles.sectionTitle}>Recent Transactions</h3>
        {transactions.length === 0 ? (
          <div style={styles.noTransactions}>
            <p>No transactions yet</p>
          </div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Method</th>
                  <th style={styles.th}>Description</th>
                  <th style={{...styles.th, textAlign: "right"}}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, idx) => (
                  <tr 
                    key={transaction._id || Math.random()} 
                    style={idx % 2 !== 0 ? styles.alternateRow : {}}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#f0f4f8"}
                    onMouseOut={(e) => e.target.style.backgroundColor = idx % 2 !== 0 ? styles.alternateRow.backgroundColor : ""}
                  >
                    <td style={styles.td}>
                      {new Date(transaction.date).toLocaleString()}
                    </td>
                    <td style={styles.td}>
                      <span style={styles.methodTag}>
                        {transaction.method || 'N/A'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {transaction.description || 'No description'}
                    </td>
                    <td style={{...styles.td, ...styles.amountCell}}>
                      ₹{(transaction.amount || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingTracker;
