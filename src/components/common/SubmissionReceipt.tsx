import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Download, Printer, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface SubmissionReceiptProps {
  applicationNumber: string;
  schemeName: string;
  submittedData: Record<string, any>;
  submittedAt: string;
  sessionId: string;
}

export default function SubmissionReceipt({
  applicationNumber,
  schemeName,
  submittedData,
  submittedAt,
  sessionId,
}: SubmissionReceiptProps) {
  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  const handleDownload = () => {
    const receiptContent = generateReceiptHTML();
    const blob = new Blob([receiptContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `application-receipt-${applicationNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Receipt downloaded successfully');
  };

  const generateReceiptHTML = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Receipt - ${applicationNumber}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .receipt {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #4f46e5;
      padding-bottom: 20px;
    }
    .header h1 {
      color: #4f46e5;
      margin: 0 0 10px 0;
    }
    .success-badge {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      margin-top: 10px;
    }
    .section {
      margin: 20px 0;
    }
    .section-title {
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 10px;
      font-size: 16px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .info-label {
      color: #6b7280;
      font-weight: 500;
    }
    .info-value {
      color: #1f2937;
      font-weight: 600;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    .important-note {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    @media print {
      body {
        background: white;
        margin: 0;
      }
      .receipt {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>🎉 Application Submitted Successfully</h1>
      <div class="success-badge">✓ CONFIRMED</div>
      <p style="margin-top: 15px; color: #6b7280;">Citizen Seva - AI Public Service Copilot</p>
    </div>

    <div class="section">
      <div class="section-title">Application Details</div>
      <div class="info-row">
        <span class="info-label">Application Number:</span>
        <span class="info-value">${applicationNumber}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Scheme Name:</span>
        <span class="info-value">${schemeName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Submission Date:</span>
        <span class="info-value">${new Date(submittedAt).toLocaleString('en-IN', {
          dateStyle: 'full',
          timeStyle: 'short',
        })}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Session ID:</span>
        <span class="info-value">${sessionId}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Submitted Information</div>
      ${Object.entries(submittedData)
        .filter(([key]) => key !== 'userInput' && key !== 'documents')
        .map(
          ([key, value]) => `
        <div class="info-row">
          <span class="info-label">${formatFieldName(key)}:</span>
          <span class="info-value">${value || 'N/A'}</span>
        </div>
      `
        )
        .join('')}
    </div>

    ${
      submittedData.documents
        ? `
    <div class="section">
      <div class="section-title">Documents Uploaded</div>
      ${Object.entries(submittedData.documents)
        .map(
          ([docName, status]) => `
        <div class="info-row">
          <span class="info-label">${formatFieldName(docName)}:</span>
          <span class="info-value">✓ ${status}</span>
        </div>
      `
        )
        .join('')}
    </div>
    `
        : ''
    }

    <div class="important-note">
      <strong>⚠️ Important:</strong> Please save this receipt for your records. 
      You can use the Application Number to track your application status.
    </div>

    <div class="footer">
      <p><strong>Citizen Seva - AI Public Service Copilot</strong></p>
      <p>Generated on ${new Date().toLocaleString('en-IN')}</p>
      <p>This is a computer-generated receipt and does not require a signature.</p>
      <p style="margin-top: 10px;">For queries, please contact the respective scheme authority with your Application Number.</p>
    </div>
  </div>
</body>
</html>
    `;
  };

  const formatFieldName = (key: string): string => {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .trim();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
    });
  };

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-500/10 p-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Application Submitted Successfully!</h2>
          <p className="text-muted-foreground mt-2">
            Your application has been processed and submitted by the AI Agent
          </p>
        </div>
      </div>

      {/* Receipt Card */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-primary/5">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Application Receipt
            </CardTitle>
            <Badge variant="default" className="bg-green-500">
              CONFIRMED
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Application Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">Application Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Application Number</span>
                <span className="font-mono font-bold text-primary">{applicationNumber}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Scheme Name</span>
                <span className="font-semibold">{schemeName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Submission Date</span>
                <span className="font-semibold">{formatDate(submittedAt)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Session ID</span>
                <span className="font-mono text-xs">{sessionId}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Submitted Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">Submitted Information</h3>
            <div className="space-y-2">
              {Object.entries(submittedData)
                .filter(([key]) => key !== 'userInput' && key !== 'documents')
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">{formatFieldName(key)}</span>
                    <span className="font-medium">{value || 'N/A'}</span>
                  </div>
                ))}
            </div>
          </div>

          {submittedData.documents && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground">Documents Uploaded</h3>
                <div className="space-y-2">
                  {Object.entries(submittedData.documents).map(([docName, status]) => (
                    <div key={docName} className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">{formatFieldName(docName)}</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        ✓ {status as string}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Important Note */}
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-sm">
              <strong className="text-yellow-800 dark:text-yellow-200">⚠️ Important:</strong>
              <span className="text-yellow-700 dark:text-yellow-300 ml-2">
                Please save this receipt for your records. You can use the Application Number to track your
                application status.
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Button onClick={handleDownload} variant="default" className="gap-2">
          <Download className="h-4 w-4" />
          Download Receipt
        </Button>
        <Button onClick={handlePrint} variant="outline" className="gap-2">
          <Printer className="h-4 w-4" />
          Print Receipt
        </Button>
      </div>

      {/* Footer Note */}
      <div className="text-center text-xs text-muted-foreground space-y-1">
        <p>This is a computer-generated receipt and does not require a signature.</p>
        <p>For queries, please contact the respective scheme authority with your Application Number.</p>
      </div>
    </div>
  );
}
