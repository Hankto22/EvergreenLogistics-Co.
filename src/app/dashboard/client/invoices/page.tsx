import { useState } from "react";
import { useSelector } from "react-redux";
import { X } from "lucide-react";
import type { RootState } from "@/store";
import { useGetUserInvoicesQuery } from "../../../../store/shipmentApi";
import { useInitializePaymentMutation, useUpdateInvoicePaymentMutation, useGetInvoiceWithPaymentsQuery } from "../../../../store/paymentApi";

type InvoiceRecord = {
  id: string;
  invoiceCode: string;
  amount: number | string;
  currency: string;
  status: string;
  createdAt: string;
  shipment: { evgCode: string; description?: string | null };
  payments?: { status: string; amount: number | string; currency: string; createdAt: string; paymentMethod?: string | null; reference?: string }[];
};

export default function ClientInvoicesTab() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [confirmPayment, setConfirmPayment] = useState<{ invoice: InvoiceRecord; show: boolean } | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [editInvoiceForm, setEditInvoiceForm] = useState({ amount: "", currency: "USD", paymentMethod: "paystack" });
  const [actionMessage, setActionMessage] = useState("");
  const { data: invoicesData } = useGetUserInvoicesQuery();
  const [initializePayment] = useInitializePaymentMutation();
  const [updateInvoicePayment, { isLoading: updatingInvoice }] = useUpdateInvoicePaymentMutation();
  const { data: invoiceDetail, isFetching: loadingInvoiceDetail } = useGetInvoiceWithPaymentsQuery(selectedInvoiceId!, { skip: !selectedInvoiceId });

  const invoices = (invoicesData || []) as InvoiceRecord[];

  const handleInvoiceUpdate = async (action: "update" | "cancel") => {
    if (!selectedInvoiceId) return;
    try {
      await updateInvoicePayment({
        invoiceId: selectedInvoiceId,
        payload: action === "cancel"
          ? { action: "cancel" }
          : {
              amount: editInvoiceForm.amount ? Number(editInvoiceForm.amount) : undefined,
              currency: editInvoiceForm.currency,
              paymentMethod: editInvoiceForm.paymentMethod,
              action: "update",
            },
      }).unwrap();
      setActionMessage(action === "cancel" ? "Invoice cancelled" : "Invoice updated");
      setSelectedInvoiceId(null);
    } catch (error) {
      setActionMessage("Failed to update invoice");
    }
  };

  const proceedWithPayment = async () => {
    if (!confirmPayment?.invoice) return;
    try {
      const inv = confirmPayment.invoice;
      const result = await initializePayment({
        invoiceId: inv.id,
        email: user?.email || '',
        amount: Math.round(Number(inv.amount) * 100)
      }).unwrap();
      setConfirmPayment(null);
      window.location.href = result.authorization_url;
    } catch (error) {
      setActionMessage('Failed to initiate payment');
      setConfirmPayment(null);
    }
  };

  const closeInvoiceDetail = () => setSelectedInvoiceId(null);

  return (
    <section className="client-section">
      <div className="section-head">
        <h2>Recent Invoices</h2>
      </div>

      <div className="panel invoices-panel">
        <div className="table table-invoices">
          <div className="table-head">
            <span>Invoice ID</span>
            <span>Shipment</span>
            <span>Amount</span>
            <span>Date</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {invoices.map(inv => (
            <div key={inv.id} className="table-row">
              <span>{inv.invoiceCode}</span>
              <span>{inv.shipment.evgCode}</span>
              <span>{inv.currency} {Number(inv.amount).toFixed(2)}</span>
              <span>{new Date(inv.createdAt).toLocaleDateString()}</span>
              <span>
                <span className={`pill ${inv.status.toLowerCase()}`}>{inv.status}</span>
              </span>
              <span className="flex flex-wrap gap-2">
                {inv.status === "UNPAID" && (
                  <button
                    className="primary-btn sm"
                    onClick={() => setConfirmPayment({ invoice: inv, show: true })}
                  >
                    Pay Now
                  </button>
                )}
                <button className="ghost-btn sm" onClick={() => setSelectedInvoiceId(inv.id)}>Manage</button>
                <button className="link" onClick={() => setActionMessage(`Preparing download for invoice ${inv.invoiceCode}`)}>Download</button>
              </span>
            </div>
          ))}
        </div>
      </div>
      {actionMessage && <p className="mt-4 text-sm text-green-700">{actionMessage}</p>}

      {confirmPayment?.show && (
        <div className="modal-overlay" onClick={() => setConfirmPayment(null)}>
          <div className="modal-content max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Payment</h3>
              <button className="modal-close" onClick={() => setConfirmPayment(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body space-y-2">
              <p className="font-semibold">{confirmPayment.invoice.invoiceCode}</p>
              <p>Shipment: {confirmPayment.invoice.shipment.evgCode}</p>
              <p>Amount: {confirmPayment.invoice.currency} {Number(confirmPayment.invoice.amount).toFixed(2)}</p>
              <p className="text-sm text-gray-500">You will be redirected to Paystack to complete this payment.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setConfirmPayment(null)}>Cancel</button>
              <button className="btn-primary" onClick={proceedWithPayment}>Proceed</button>
            </div>
          </div>
        </div>
      )}

      {selectedInvoiceId && invoiceDetail && (
        <div className="modal-overlay" onClick={closeInvoiceDetail}>
          <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Invoice {invoiceDetail.invoiceCode}</h3>
              <button className="modal-close" onClick={closeInvoiceDetail}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600">Shipment</p>
                  <p className="font-semibold">{invoiceDetail.shipment.evgCode}</p>
                  <p className="text-sm text-gray-600 mt-2">Status</p>
                  <span className={`pill ${invoiceDetail.status.toLowerCase()}`}>{invoiceDetail.status}</span>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    value={editInvoiceForm.amount}
                    onChange={(e) => setEditInvoiceForm({ ...editInvoiceForm, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={invoiceDetail.status === "PAID"}
                  />
                  <label className="block text-sm font-medium text-gray-700">Currency</label>
                  <input
                    value={editInvoiceForm.currency}
                    onChange={(e) => setEditInvoiceForm({ ...editInvoiceForm, currency: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={invoiceDetail.status === "PAID"}
                  />
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <input
                    value={editInvoiceForm.paymentMethod}
                    onChange={(e) => setEditInvoiceForm({ ...editInvoiceForm, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={invoiceDetail.status === "PAID"}
                  />
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2">Payment History</p>
                <div className="table">
                  <div className="table-head">
                    <span>Reference</span>
                    <span>Status</span>
                    <span>Amount</span>
                    <span>Date</span>
                  </div>
                  {invoiceDetail.payments?.map((payment) => (
                    <div key={payment.reference ?? payment.createdAt} className="table-row">
                      <span>{payment.reference}</span>
                      <span><span className={`pill ${payment.status.toLowerCase()}`}>{payment.status}</span></span>
                      <span>{payment.currency} {Number(payment.amount).toFixed(2)}</span>
                      <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                  {(invoiceDetail.payments || []).length === 0 && (
                    <div className="table-row">
                      <span className="text-sm text-gray-500">No payments recorded yet.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeInvoiceDetail}>Close</button>
              {invoiceDetail.status !== "PAID" && (
                <>
                  <button className="btn-primary" disabled={updatingInvoice} onClick={() => handleInvoiceUpdate("update")}>
                    {updatingInvoice ? "Saving..." : "Save Changes"}
                  </button>
                  <button className="btn-ghost" disabled={updatingInvoice} onClick={() => handleInvoiceUpdate("cancel")}>
                    Cancel Invoice
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedInvoiceId && loadingInvoiceDetail && (
        <div className="modal-overlay" onClick={closeInvoiceDetail}>
          <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body">Loading invoice details...</div>
          </div>
        </div>
      )}
    </section>
  );
}
