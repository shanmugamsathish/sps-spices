import jsPDF from 'jspdf';



// Generate invoice PDF for Shopify orders
export const generateShopifyInvoicePDF = (order) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Theme colors
    const primaryColor = [79, 53, 33]; // #4F3521
    const secondaryColor = [107, 74, 46]; // #6B4A2E
    const accentColor = [184, 134, 11]; // #B8860B
    const bgLight = [249, 249, 249]; // #F9F9F9

    // Helper function to add text with alignment
    const addText = (text, x, y, fontSize = 12, fontStyle = 'normal', align = 'left', color = [0, 0, 0]) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontStyle);
      pdf.setTextColor(...color);
      if (align === 'center') {
        const textWidth = pdf.getTextWidth(text);
        const centerX = (pageWidth - textWidth) / 2;
        pdf.text(text, centerX, y);
      } else if (align === 'right') {
        const textWidth = pdf.getTextWidth(text);
        const rightX = x - textWidth;
        pdf.text(text, rightX, y);
      } else {
        pdf.text(text, x, y);
      }
      pdf.setTextColor(0, 0, 0);
    };

    // Helper function to add a horizontal line
    const addLine = (y, color = primaryColor, width = 0.5) => {
      pdf.setDrawColor(...color);
      pdf.setLineWidth(width);
      pdf.line(margin, y, pageWidth - margin, y);
    };


    // Format date
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        return dateString;
      }
    };

    // Get customer name
    const getCustomerName = () => {
      if (order.customer) {
        const firstName = order.customer.first_name || '';
        const lastName = order.customer.last_name || '';
        return `${firstName} ${lastName}`.trim() || order.customer.email || 'N/A';
      }
      return order.email || order.billing_address?.name || 'N/A';
    };

    // Get shipping/billing address
    const address = order.shipping_address || order.billing_address || {};
    const customerName = getCustomerName();
    const customerEmail = order.customer?.email || order.email || order.contact_email || 'N/A';
    const customerPhone = address.phone || order.customer?.phone || 'N/A';

    // --- HEADER (Theme accent color bar) ---
    pdf.setFillColor(...accentColor);
    pdf.rect(margin, yPosition, pageWidth - margin * 2, 18, 'F');
    addText('INVOICE', pageWidth / 2, yPosition + 12, 24, 'bold', 'center', [255, 255, 255]);
    yPosition += 24;

    yPosition += 10;
    // Company name and details
    addText('SPS SPICES AND DRY FRUITS', margin, yPosition, 14, 'bold', 'left', primaryColor);
    addText('www.spsspicesanddryfruits.com', pageWidth - margin, yPosition, 10, 'normal', 'right', secondaryColor);
    yPosition += 8;

    // --- Invoice To & Details ---
    yPosition += 4;
    addText('Invoice To:', margin, yPosition, 12, 'bold', 'left', primaryColor);
    addText('Invoice Details:', pageWidth - margin, yPosition, 12, 'bold', 'right', primaryColor);
    yPosition += 7;

    // Customer Info (Left)
    addText(customerName, margin, yPosition, 11, 'bold');
    addText(`Invoice #: ${order.name || order.order_number || order.id}`, pageWidth - margin, yPosition, 10, 'normal', 'right');
    yPosition += 6;

    if (address.address1) {
      addText(address.address1, margin, yPosition, 10);
      addText(`Date: ${formatDate(order.processed_at || order.created_at)}`, pageWidth - margin, yPosition, 10, 'normal', 'right');
      yPosition += 5;
    }

    if (address.address2) {
      addText(address.address2, margin, yPosition, 10);
    }

    const cityStateZip = [
      address.city,
      address.province,
      address.zip
    ].filter(Boolean).join(', ');

    if (cityStateZip) {
      if (address.address2) yPosition += 5;
      addText(cityStateZip, margin, yPosition, 10);
      const statusText = order.fulfillment_status === 'fulfilled' ? 'Paid & Fulfilled' :
        order.financial_status === 'paid' ? 'Paid' : 'Pending';
      addText(`Status: ${statusText}`, pageWidth - margin, yPosition, 10, 'normal', 'right',
        order.fulfillment_status === 'fulfilled' ? [0, 128, 0] : [184, 134, 11]);
      yPosition += 5;
    }

    if (address.country) {
      addText(address.country, margin, yPosition, 10);
      yPosition += 5;
    }

    if (customerPhone && customerPhone !== 'N/A') {
      addText(`Phone: ${customerPhone}`, margin, yPosition, 10);
      yPosition += 5;
    }

    if (customerEmail && customerEmail !== 'N/A') {
      addText(`Email: ${customerEmail}`, margin, yPosition, 10);
    }



    yPosition += 10;
    addCutHereLine(pdf, pageWidth, margin, yPosition);
    yPosition += 10;

    // --- Order Items Table ---
    addText('Order Items:', margin, yPosition, 13, 'bold', 'left', primaryColor);
    yPosition += 8;

    // Calculate table column positions based on page width
    const tableWidth = pageWidth - (margin * 2);
    const colItemStart = margin;
    const colItemWidth = tableWidth * 0.50; // 50% for item name
    const colQtyWidth = tableWidth * 0.12;  // 12% for quantity
    const colPriceWidth = tableWidth * 0.19; // 19% for price
    const colTotalWidth = tableWidth * 0.19; // 19% for total

    const colItem = colItemStart;
    const colQty = colItem + colItemWidth;
    const colPrice = colQty + colQtyWidth;
    const colTotal = colPrice + colPriceWidth;
    const rowHeight = 18;

    // Table Header Background (Theme accent color)
    pdf.setFillColor(...accentColor);
    pdf.setTextColor(255, 255, 255);
    pdf.rect(margin, yPosition - 5, tableWidth, rowHeight, 'F');
    pdf.setDrawColor(...primaryColor);
    pdf.setLineWidth(0.3);
    pdf.rect(margin, yPosition - 5, tableWidth, rowHeight);

    // Table Headers - properly aligned
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('Item', colItem + 3, yPosition + 5);

    // Right-align numeric columns
    const qtyText = 'Qty';
    const priceText = 'Price';
    const totalText = 'Total';

    pdf.text(qtyText, colQty + colQtyWidth - 3, yPosition + 5, { align: 'right' });
    pdf.text(priceText, colPrice + colPriceWidth - 3, yPosition + 5, { align: 'right' });
    pdf.text(totalText, colTotal + colTotalWidth - 3, yPosition + 5, { align: 'right' });

    yPosition += rowHeight;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    // Table Rows
    const lineItems = order.line_items || [];
    lineItems.forEach((item, idx) => {
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = margin;
      }

      // Zebra striping with light background
      if (idx % 2 === 0) {
        pdf.setFillColor(...bgLight);
        pdf.rect(margin, yPosition - 5, tableWidth, rowHeight, 'F');
      }

      // Row border
      pdf.setDrawColor(...primaryColor);
      pdf.setLineWidth(0.2);
      pdf.line(margin, yPosition - 5, pageWidth - margin, yPosition - 5);

      // Item title (with variant if exists)
      let itemTitle = item.title || 'Product';
      if (item.variant_title && item.variant_title !== item.title) {
        itemTitle = `${item.title} - ${item.variant_title}`;
      }

      // Truncate if too long to fit column
      const maxItemWidth = colItemWidth - 6; // Leave padding
      pdf.setFontSize(10);
      const itemTitleWidth = pdf.getTextWidth(itemTitle);
      if (itemTitleWidth > maxItemWidth) {
        // Truncate item title
        let truncated = itemTitle;
        while (pdf.getTextWidth(truncated + '...') > maxItemWidth && truncated.length > 0) {
          truncated = truncated.substring(0, truncated.length - 1);
        }
        itemTitle = truncated + '...';
      }

      pdf.text(itemTitle, colItem + 3, yPosition + 5);

      // Quantity (right-aligned) - simple number format
      const qty = item.quantity || 1;
      const qtyStr = String(qty);
      const qtyX = colQty + colQtyWidth - 3;
      pdf.text(qtyStr, qtyX, yPosition + 5, { align: 'right' });

      // Price (right-aligned) - format without locale to avoid spacing
      const price = parseFloat(item.price || 0);
      const priceFormatted = price.toFixed(2);
      const priceStr = `Rs. ${priceFormatted}`;
      const priceX = colPrice + colPriceWidth - 3;
      pdf.text(priceStr, priceX, yPosition + 5, { align: 'right' });

      // Total (right-aligned) - format without locale to avoid spacing
      const itemTotal = price * qty;
      const totalFormatted = itemTotal.toFixed(2);
      const totalStr = `Rs. ${totalFormatted}`;
      const totalX = colTotal + colTotalWidth - 3;
      pdf.text(totalStr, totalX, yPosition + 5, { align: 'right' });

      yPosition += rowHeight;
    });

    // --- Calculate totals ---
    const subtotal = parseFloat(order.subtotal_price || order.total_line_items_price || order.total_price || 0);
    const totalDiscounts = parseFloat(order.total_discounts || 0);
    // const totalTax = parseFloat(order.total_tax || 0);
    // const shippingPrice = parseFloat((order.shipping_lines?.[0]?.price || 0));
    const total = parseFloat(order.total_price || order.current_total_price || 0);

    // --- Summary (Right-aligned to match table) ---
    yPosition += 4;
    addLine(yPosition, primaryColor, 0.2);
    yPosition += 8;

    // Align summary with table's Total column
    const summaryRightEdge = colTotal + colTotalWidth - 3;
    const summaryLabelStart = summaryRightEdge - 30; // Space for label

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);

    // Subtotal - format without locale to avoid spacing
    const subtotalFormatted = `Rs. ${subtotal.toFixed(2)}`;
    pdf.text('Subtotal:', summaryLabelStart, yPosition, { align: 'right' });
    pdf.text(subtotalFormatted, summaryRightEdge, yPosition, { align: 'right' });
    yPosition += 6;

    // Discounts - format without locale to avoid spacing
    const discountFormatted = `Rs. ${totalDiscounts.toFixed(2)}`;
    pdf.setTextColor(0, 128, 0);
    pdf.text('Discount:', summaryLabelStart, yPosition, { align: 'right' });
    pdf.text(`-${discountFormatted}`, summaryRightEdge, yPosition, { align: 'right' });
    pdf.setTextColor(0, 0, 0);
    yPosition += 6;

    // // Shipping - format without locale to avoid spacing
    // const shippingFormatted = `Rs. ${shippingPrice.toFixed(2)}`;
    // pdf.text('Shipping:', summaryLabelStart, yPosition, { align: 'right' });
    // pdf.text(shippingFormatted, summaryRightEdge, yPosition, { align: 'right' });
    // yPosition += 6;

    // // Tax - format without locale to avoid spacing
    // const taxFormatted = `Rs. ${totalTax.toFixed(2)}`;
    // pdf.text('Tax:', summaryLabelStart, yPosition, { align: 'right' });
    // pdf.text(taxFormatted, summaryRightEdge, yPosition, { align: 'right' });
    // yPosition += 6;

    // Total (highlighted) - format without locale to avoid spacing
    yPosition += 2;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(...primaryColor);
    const totalFormatted = `Rs. ${total.toFixed(2)}`;
    pdf.text('Total:', summaryLabelStart, yPosition, { align: 'right' });
    pdf.text(totalFormatted, summaryRightEdge, yPosition, { align: 'right' });
    pdf.setTextColor(0, 0, 0);
    yPosition += 8;

    // Payment method if available
    if (order.payment_gateway_names && order.payment_gateway_names.length > 0) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(...secondaryColor);
      addText(`Payment Method: ${order.payment_gateway_names.join(', ')}`, margin, yPosition, 10, 'normal', 'left');
      yPosition += 6;
    }

    pdf.setTextColor(0, 0, 0);
    addLine(yPosition, primaryColor, 0.8);
    yPosition += 10;

    // Footer

    // Order note if available-center aligned
    if (order.note) {
      pdf.setTextColor(...secondaryColor);
      addText(`Note: ${order.note}`, pageWidth / 2, yPosition, 9, 'normal', 'center');
      yPosition += 6;
    }

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    addText('Thank you for your purchase!', pageWidth / 2, yPosition, 12, 'bold', 'center', primaryColor);
    yPosition += 6;
    addText('For any queries, please contact our customer support.', pageWidth / 2, yPosition, 10, 'normal', 'center', secondaryColor);
    yPosition += 5;
    addText(`Generated on: ${new Date().toLocaleString('en-IN')}`, pageWidth / 2, yPosition, 9, 'normal', 'center', secondaryColor);
    yPosition += 5;
    addText('Please note:this is not a GST invoice', pageWidth / 2, yPosition, 9, 'normal', 'center', secondaryColor);

    // Download PDF
    const orderNumber = order.name || order.order_number || order.id;
    const fileName = `SPS_${orderNumber}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    return { success: true, fileName };
  } catch (error) {
    console.error('Error generating Shopify invoice PDF:', error);
    return { success: false, error: error.message };
  }
};

function addCutHereLine(pdf, pageWidth, margin, y) {
  const centerX = pageWidth / 2;
  const text = '— Cut Here —';

  // Dashed line
  pdf.setLineDash([3, 3]);
  pdf.setLineWidth(0.5);
  pdf.line(margin, y, pageWidth - margin, y);
  pdf.setLineDash([]);

  // Measure text width
  const textWidth = pdf.getTextWidth(text);

  // White background strip to "cut" the line behind text
  pdf.setFillColor(255, 255, 255);
  pdf.rect(centerX - textWidth / 2 - 2, y - 4, textWidth + 4, 6, 'F');

  // Draw text exactly on the line
  pdf.setFontSize(9);
  pdf.setTextColor(150, 150, 150);
  pdf.text(text, centerX, y + 2, { align: 'center' });

  // Reset color
  pdf.setTextColor(0, 0, 0);
}

