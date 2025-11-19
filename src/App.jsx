import React, { useState, useEffect } from "react";
import {
    Users,
    Plus,
    Search,
    Edit2,
    Trash2,
    Phone,
    Mail,
    Calendar,
} from "lucide-react";

export const App = () => {
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        status: "yangi",
        notes: "",
    });

    // Telegram WebApp ni sozlash
    useEffect(() => {
        if (window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();
            tg.expand();
            tg.MainButton.setText("Saqlash");
            tg.MainButton.hide();
        }

        // Test ma'lumotlar
        const sampleClients = [
            {
                id: 1,
                name: "Alisher Karimov",
                phone: "+998901234567",
                email: "alisher@example.com",
                status: "faol",
                notes: "Muhim mijoz",
                date: "2024-11-15",
            },
            {
                id: 2,
                name: "Dilshod Toshmatov",
                phone: "+998907654321",
                email: "dilshod@example.com",
                status: "yangi",
                notes: "",
                date: "2024-11-18",
            },
        ];
        setClients(sampleClients);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingClient) {
            setClients(
                clients.map((c) =>
                    c.id === editingClient.id
                        ? { ...formData, id: c.id, date: c.date }
                        : c
                )
            );
        } else {
            const newClient = {
                ...formData,
                id: Date.now(),
                date: new Date().toISOString().split("T")[0],
            };
            setClients([newClient, ...clients]);
        }

        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: "",
            phone: "",
            email: "",
            status: "yangi",
            notes: "",
        });
        setEditingClient(null);
        setShowModal(false);
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setFormData({
            name: client.name,
            phone: client.phone,
            email: client.email,
            status: client.status,
            notes: client.notes,
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm("Rostdan ham o'chirmoqchimisiz?")) {
            setClients(clients.filter((c) => c.id !== id));
        }
    };

    const filteredClients = clients.filter(
        (client) =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.phone.includes(searchTerm) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        const colors = {
            yangi: "bg-blue-100 text-blue-800",
            faol: "bg-green-100 text-green-800",
            kutilmoqda: "bg-yellow-100 text-yellow-800",
            tugatilgan: "bg-gray-100 text-gray-800",
        };
        return colors[status] || colors.yangi;
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sticky top-0 z-10 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Users className="w-8 h-8" />
                        <h1 className="text-2xl font-bold">CRM Tizimi</h1>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-white text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Qidirish..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="p-4 grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-gray-600 text-sm">Jami mijozlar</div>
                    <div className="text-2xl font-bold text-blue-600">
                        {clients.length}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-gray-600 text-sm">Faol</div>
                    <div className="text-2xl font-bold text-green-600">
                        {clients.filter((c) => c.status === "faol").length}
                    </div>
                </div>
            </div>

            {/* Client List */}
            <div className="p-4 space-y-3">
                {filteredClients.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Mijozlar topilmadi</p>
                    </div>
                ) : (
                    filteredClients.map((client) => (
                        <div
                            key={client.id}
                            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-800">
                                        {client.name}
                                    </h3>
                                    <span
                                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(
                                            client.status
                                        )}`}
                                    >
                                        {client.status}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(client)}
                                        className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(client.id)}
                                        className="text-red-600 hover:bg-red-50 p-2 rounded"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    <a
                                        href={`tel:${client.phone}`}
                                        className="hover:text-blue-600"
                                    >
                                        {client.phone}
                                    </a>
                                </div>
                                {client.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        <a
                                            href={`mailto:${client.email}`}
                                            className="hover:text-blue-600"
                                        >
                                            {client.email}
                                        </a>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{client.date}</span>
                                </div>
                                {client.notes && (
                                    <p className="text-gray-500 italic mt-2">
                                        {client.notes}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-4 border-b sticky top-0 bg-white">
                            <h2 className="text-xl font-bold">
                                {editingClient
                                    ? "Mijozni tahrirlash"
                                    : "Yangi mijoz"}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ism *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Telefon *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            phone: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="+998901234567"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            status: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="yangi">Yangi</option>
                                    <option value="faol">Faol</option>
                                    <option value="kutilmoqda">
                                        Kutilmoqda
                                    </option>
                                    <option value="tugatilgan">
                                        Tugatilgan
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Izohlar
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            notes: e.target.value,
                                        })
                                    }
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Saqlash
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
