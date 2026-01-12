import { generateShopifyInvoicePDF } from '../utils/pdfGenerator'
import toast from 'react-hot-toast'
import { getAdminOrderById } from '../apiCalls/orders'

export const useDownloadPDF = (setIsGeneratingPDF) => {
    const handleDownloadPDF = async (orderId) => {
        if (!orderId) {
            toast.error('Order ID is required');
            return;
        }
        
        setIsGeneratingPDF(true);
        try {
            // Fetch the full order details
            const response = await getAdminOrderById(orderId);
            
            if (!response?.success || !response.order) {
                toast.error('Failed to fetch order details');
                return;
            }

            const order = response.order;
            
            // Generate PDF with Shopify order structure
            const result = generateShopifyInvoicePDF(order);
            
            if (result.success) {
                console.log('PDF generated successfully:', result.fileName);
                toast.success('Invoice downloaded successfully');
            } else {
                console.error('Failed to generate PDF:', result.error);
                toast.error(result.error || 'Failed to generate PDF');
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error(error.response?.data?.error || error.message || 'Error generating PDF');    
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    return { handleDownloadPDF }
}