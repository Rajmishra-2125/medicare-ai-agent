import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Generates and downloads a PDF Invoice for a specific transaction.
 * @param {Object} transaction - Data object mapping from an Appointment schema.
 */
export const generateInvoice = (transaction) => {
  const doc = new jsPDF();
  
  // Platform Header configuration
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(79, 70, 229); // indigo-600
  doc.text("Healthcare Platform", 14, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text("Official Invoice Statement", 14, 32);
  doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, 14, 38);

  // Line break
  doc.setLineWidth(0.5);
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.line(14, 45, 196, 45);

  // Transaction details header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(`Invoice ID: ${transaction.id || "INV-0000"}`, 14, 60);

  // Patient and Doctor Box Layouts
  doc.setFontSize(10);
  
  // Patient details (Left col)
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("Billed To:", 14, 75);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(String(transaction.patient), 14, 82);
  if(transaction.patientEmail) doc.text(String(transaction.patientEmail), 14, 88);

  // Doctor details (Right col)
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("Medical Provider:", 120, 75);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(String(transaction.doctor), 120, 82);
  if(transaction.specialization) doc.text(String(transaction.specialization), 120, 88);

  // Services breakdown mapping to autotable payload
  const tableData = [
    [
      "Medical Consultation",
      new Date(transaction.date).toLocaleDateString(),
      transaction.method || "Online",
      transaction.status || "Completed",
      `₹${transaction.amount}`
    ]
  ];

  doc.autoTable({
    startY: 110,
    head: [["Service Description", "Date", "Payment Method", "Status", "Amount"]],
    body: tableData,
    theme: "striped",
    headStyles: { 
      fillColor: [79, 70, 229],
      textColor: [255, 255, 255],
      fontStyle: "bold"
    },
    styles: {
      fontSize: 10,
      cellPadding: 6,
      textColor: [15, 23, 42]
    },
    columnStyles: {
      4: { halign: 'right', fontStyle: 'bold' } // Amounts column
    }
  });

  // Calculate position after table
  const finalY = doc.lastAutoTable.finalY + 10;
  
  // Totals Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  // Place total line near right edge
  doc.text("Total Amount Paid:", 120, finalY);
  doc.setTextColor(79, 70, 229);
  doc.text(`₹${transaction.amount}`, 165, finalY);

  // Footer Disclaimers
  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text("Thank you for choosing our Healthcare Platform.", 14, 270);
  doc.text("This is an electronically generated invoice and does not require a physical signature.", 14, 275);

  // Export / Download action
  doc.save(`Invoice_${transaction.id || "Unknown"}.pdf`);
};
