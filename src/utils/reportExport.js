import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Format date to Italian locale
 */
const formatDate = (date) => {
    return date.toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Export report to PDF
 */
export const exportToPDF = (reportData, selectedDate) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(147, 51, 234); // Purple color
    doc.text('Report Serata VIP', 105, 20, { align: 'center' });

    // Date
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(formatDate(selectedDate), 105, 30, { align: 'center' });

    // Summary Statistics
    const totalGuests = reportData.totalGuests || 0;
    const totalArrived = reportData.totalArrived || 0;
    const totalMissing = totalGuests - totalArrived;
    const arrivalRate = totalGuests > 0 ? Math.round((totalArrived / totalGuests) * 100) : 0;

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Riepilogo Generale', 14, 45);

    // Summary table
    autoTable(doc, {
        startY: 50,
        head: [['Metrica', 'Valore']],
        body: [
            ['Tavoli Prenotati', reportData.tables.length.toString()],
            ['Ospiti Totali', totalGuests.toString()],
            ['Ospiti Arrivati', totalArrived.toString()],
            ['Ospiti Mancanti', totalMissing.toString()],
            ['Tasso di Arrivo', `${arrivalRate}%`]
        ],
        theme: 'striped',
        headStyles: { fillColor: [147, 51, 234] },
        margin: { left: 14, right: 14 }
    });

    // Tables detail
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text('Dettaglio Tavoli', 14, finalY);

    const tableData = reportData.tables.map(table => {
        const arrivedCount = table.guestsArrived;
        const totalCount = table.guestsTotal;
        const missing = totalCount - arrivedCount;
        const tableRate = totalCount > 0 ? Math.round((arrivedCount / totalCount) * 100) : 0;

        return [
            table.name,
            table.bookingName || 'VIP Booking',
            totalCount.toString(),
            arrivedCount.toString(),
            missing.toString(),
            `${tableRate}%`
        ];
    });

    autoTable(doc, {
        startY: finalY + 5,
        head: [['Tavolo', 'Prenotazione', 'Prenotati', 'Arrivati', 'Mancanti', 'Tasso']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        margin: { left: 14, right: 14 },
        columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 40 },
            2: { cellWidth: 25, halign: 'center' },
            3: { cellWidth: 25, halign: 'center' },
            4: { cellWidth: 25, halign: 'center' },
            5: { cellWidth: 25, halign: 'center' }
        }
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
            `Pagina ${i} di ${pageCount}`,
            105,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
        );
    }

    // Save the PDF
    const fileName = `report_serata_${selectedDate.toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
};

/**
 * Export report to CSV
 */
export const exportToCSV = (reportData, selectedDate) => {
    const totalGuests = reportData.totalGuests || 0;
    const totalArrived = reportData.totalArrived || 0;
    const totalMissing = totalGuests - totalArrived;
    const arrivalRate = totalGuests > 0 ? Math.round((totalArrived / totalGuests) * 100) : 0;

    // CSV Header
    let csvContent = 'Report Serata VIP\n';
    csvContent += `Data,${formatDate(selectedDate)}\n`;
    csvContent += '\n';

    // Summary
    csvContent += 'RIEPILOGO GENERALE\n';
    csvContent += 'Metrica,Valore\n';
    csvContent += `Tavoli Prenotati,${reportData.tables.length}\n`;
    csvContent += `Ospiti Totali,${totalGuests}\n`;
    csvContent += `Ospiti Arrivati,${totalArrived}\n`;
    csvContent += `Ospiti Mancanti,${totalMissing}\n`;
    csvContent += `Tasso di Arrivo,${arrivalRate}%\n`;
    csvContent += '\n';

    // Tables detail
    csvContent += 'DETTAGLIO TAVOLI\n';
    csvContent += 'Tavolo,Prenotazione,Prenotati,Arrivati,Mancanti,Tasso\n';

    reportData.tables.forEach(table => {
        const arrivedCount = table.guestsArrived;
        const totalCount = table.guestsTotal;
        const missing = totalCount - arrivedCount;
        const tableRate = totalCount > 0 ? Math.round((arrivedCount / totalCount) * 100) : 0;

        csvContent += `${table.name},"${table.bookingName || 'VIP Booking'}",${totalCount},${arrivedCount},${missing},${tableRate}%\n`;
    });

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `report_serata_${selectedDate.toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
