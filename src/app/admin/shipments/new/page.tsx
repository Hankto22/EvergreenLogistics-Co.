import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateShipmentMutation } from "../../../../store/shipmentApi";
import { useGetUsersQuery } from "../../../../store/authApi";

const NewShipment = () => {
  const navigate = useNavigate();
  const [createShipment, { isLoading }] = useCreateShipmentMutation();
  const { data: users } = useGetUsersQuery();

  const [formData, setFormData] = useState({
    shipmentCode: "",
    evgCode: "",
    billOfLading: "",
    containerNumber: "",
    clientId: "",
    assignedStaffId: "",
    description: "",
    originCity: "",
    originCountry: "",
    destinationCity: "",
    destinationCountry: "",
    transportMode: "",
    status: "pending",
    progressPercent: 0,
    estimatedDeliveryDate: "",
  });

  const clients = users?.filter(user => user.role === "client") || [];
  const staff = users?.filter(user => user.role === "staff") || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createShipment({
        ...formData,
        estimatedDeliveryDate: formData.estimatedDeliveryDate || undefined,
      }).unwrap();
      navigate("/admin/shipments");
    } catch (error) {
      console.error("Failed to create shipment:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Shipment</h1>
        <p className="text-gray-600">Fill in the details to create a new shipment.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shipment Code *
            </label>
            <input
              type="text"
              name="shipmentCode"
              value={formData.shipmentCode}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter shipment code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              EVG Code
            </label>
            <input
              type="text"
              name="evgCode"
              value={formData.evgCode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter EVG code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bill of Lading
            </label>
            <input
              type="text"
              name="billOfLading"
              value={formData.billOfLading}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter bill of lading"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Container Number
            </label>
            <input
              type="text"
              name="containerNumber"
              value={formData.containerNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter container number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client *
            </label>
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.fullName} ({client.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned Staff
            </label>
            <select
              name="assignedStaffId"
              value={formData.assignedStaffId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select staff (optional)</option>
              {staff.map(member => (
                <option key={member.id} value={member.id}>
                  {member.fullName} ({member.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transport Mode
            </label>
            <select
              name="transportMode"
              value={formData.transportMode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select transport mode</option>
              <option value="sea">Sea</option>
              <option value="air">Air</option>
              <option value="land">Land</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Origin City
            </label>
            <input
              type="text"
              name="originCity"
              value={formData.originCity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter origin city"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Origin Country
            </label>
            <input
              type="text"
              name="originCountry"
              value={formData.originCountry}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter origin country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination City
            </label>
            <input
              type="text"
              name="destinationCity"
              value={formData.destinationCity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter destination city"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination Country
            </label>
            <input
              type="text"
              name="destinationCountry"
              value={formData.destinationCountry}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter destination country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Delivery Date
            </label>
            <input
              type="date"
              name="estimatedDeliveryDate"
              value={formData.estimatedDeliveryDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Progress Percent
            </label>
            <input
              type="number"
              name="progressPercent"
              value={formData.progressPercent}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter shipment description"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Shipment"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/shipments")}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewShipment;
