"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building, Mail, Phone, Globe, MapPin, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CompanySettings = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [companyData, setCompanyData] = useState({
    name: "Evergreen Logistics Co. Ltd",
    email: "contact@evergreenlogistics.co.ke",
    phone: "+254 728 969 582/3",
    website: "https://evergreenlogistics.co.ke",
    address: {
      street: "123 Logistics Avenue",
      city: "Nairobi",
      state: "Nairobi County",
      country: "Kenya",
      postalCode: "00100"
    },
    taxId: "P051234567K",
    registrationNumber: "CPR/2020/123456",
    description: "Leading logistics and freight forwarding company in East Africa, specializing in ocean, air, and road transportation.",
    foundedYear: "2020",
    employeeCount: "50-100",
    industry: "Logistics & Transportation"
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setIsEditing(false);
    alert("Company settings saved successfully!");
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCompanyData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setCompanyData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/admin/settings')}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Settings
          </button>
        </div>
        <div className="flex items-center gap-3">
          <Building className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Company Information</h1>
            <p className="text-gray-600">Manage your company details and public information.</p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Company Details</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {isEditing ? "Cancel" : "Edit Information"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Building size={20} />
              Basic Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={companyData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{companyData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    <input
                      type="email"
                      value={companyData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 py-2 flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    {companyData.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <input
                      type="tel"
                      value={companyData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 py-2 flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    {companyData.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-gray-400" />
                    <input
                      type="url"
                      value={companyData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 py-2 flex items-center gap-2">
                    <Globe size={16} className="text-gray-400" />
                    <a href={companyData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {companyData.website}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <MapPin size={20} />
              Address Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={companyData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{companyData.address.street}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={companyData.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{companyData.address.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={companyData.address.postalCode}
                      onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{companyData.address.postalCode}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={companyData.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{companyData.address.state}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={companyData.address.country}
                    onChange={(e) => handleInputChange('address.country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{companyData.address.country}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="mt-8 pt-8 border-t">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Business Information</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax ID
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={companyData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{companyData.taxId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={companyData.registrationNumber}
                    onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{companyData.registrationNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={companyData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{companyData.industry}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Founded Year
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={companyData.foundedYear}
                    onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{companyData.foundedYear}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Count
                </label>
                {isEditing ? (
                  <select
                    value={companyData.employeeCount}
                    onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="50-100">50-100 employees</option>
                    <option value="100-500">100-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                ) : (
                  <p className="text-gray-900 py-2">{companyData.employeeCount}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Description
            </label>
            {isEditing ? (
              <textarea
                value={companyData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your company..."
              />
            ) : (
              <p className="text-gray-900 py-2">{companyData.description}</p>
            )}
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="mt-8 pt-6 border-t flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save size={16} />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CompanySettings;