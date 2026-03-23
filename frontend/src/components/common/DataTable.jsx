import { Card, Box, Typography, Tooltip, Link, ButtonGroup, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Empty } from 'antd';
import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

function TableToolbar({ columns, rows }) {
  const exportData = columns
    .filter(c => c.field !== 'actions' && c.field !== 'status')
    .map(c => c.headerName);

  const getRowData = () => rows.map(row =>
    columns
      .filter(c => c.field !== 'actions' && c.field !== 'status')
      .map(c => row[c.field] ?? '')
  );

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, { head: [exportData], body: getRowData() });
    doc.save('export.pdf');
  };

  const exportCSV = () => {
    const ws = XLSX.utils.aoa_to_sheet([exportData, ...getRowData()]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'export.csv');
  };

  const exportExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([exportData, ...getRowData()]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'export.xlsx');
  };

  const handleCopy = () => {
    const text = [exportData, ...getRowData()].map(r => r.join('\t')).join('\n');
    navigator.clipboard.writeText(text);
  };

  const handlePrint = () => window.print();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1, gap: 1 }}>
      <ButtonGroup size="small" variant="outlined">
        <Tooltip title="Copy to clipboard" arrow><Button onClick={handleCopy}>Copy</Button></Tooltip>
        <Tooltip title="Export as CSV" arrow><Button onClick={exportCSV}>CSV</Button></Tooltip>
        <Tooltip title="Export as Excel" arrow><Button onClick={exportExcel}>Excel</Button></Tooltip>
        <Tooltip title="Export as PDF" arrow><Button onClick={exportPDF}>PDF</Button></Tooltip>
        <Tooltip title="Print" arrow><Button onClick={handlePrint}>Print</Button></Tooltip>
      </ButtonGroup>
    </Box>
  );
}

function NoRowsOverlay() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    </Box>
  );
}

function CellContent({ value, type }) {
  if (!value) return <Typography variant="body2" color="text.disabled">—</Typography>;

  const text = String(value);

  const getHref = () => {
    if (type === 'email') return `mailto:${text}`;
    if (type === 'phone') return `tel:${text}`;
    if (type === 'link') return text;
    return null;
  };

  const href = getHref();

  const content = href ? (
    <Link
      href={href}
      target={type === 'link' ? '_blank' : undefined}
      rel={type === 'link' ? 'noopener noreferrer' : undefined}
      underline="hover"
      sx={{ color: 'primary.main', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', maxWidth: '100%' }}
    >
      {text}
    </Link>
  ) : (
    <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', maxWidth: '100%' }}>
      {text}
    </Typography>
  );

  return (
    <Tooltip title={text} arrow placement="top">
      <Box sx={{ overflow: 'hidden', width: '100%' }}>{content}</Box>
    </Tooltip>
  );
}

function DataTable({ 
  columns, 
  dataSource, 
  checkboxSelection = false,
  showToolbar = false,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  onPaginationChange
}) {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: pageSize,
  });

  const handlePaginationChange = (newModel) => {
    setPaginationModel(newModel);
    if (onPaginationChange) {
      onPaginationChange({
        page: newModel.page,
        pageSize: newModel.pageSize,
        startRow: newModel.page * newModel.pageSize,
        endRow: (newModel.page + 1) * newModel.pageSize,
      });
    }
  };
  const gridColumns = columns.map(col => ({
    field: col.dataIndex || col.key,
    headerName: col.title,
    flex: col.flex || 1,
    minWidth: col.width || 100,
    sortable: col.sortable !== false,
    filterable: col.filterable !== false,
    renderCell: col.render
      ? (params) => col.render(params.value, params.row)
      : (params) => <CellContent value={params.value} type={col.type} />,
  }));

  const rows = dataSource.map((row, index) => ({
    ...row,
    id: row._id || row.id || row.key || index,
  }));

  return (
    <Card 
      elevation={0}
      sx={{ 
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 2,
      }}
    >
      <Box sx={{ width: '100%' }}>
        {showToolbar && <TableToolbar columns={gridColumns} rows={rows} />}
        <DataGrid
          rows={rows}
          columns={gridColumns}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationChange}
          pageSizeOptions={pageSizeOptions}
          checkboxSelection={checkboxSelection}
          slots={{ noRowsOverlay: NoRowsOverlay }}
          slotProps={{ noRowsOverlay: {} }}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            border: 0,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'action.hover',
              fontWeight: 600,
            },
            '& .MuiDataGrid-cell': {
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        />
      </Box>
    </Card>
  );
}

export default DataTable;
