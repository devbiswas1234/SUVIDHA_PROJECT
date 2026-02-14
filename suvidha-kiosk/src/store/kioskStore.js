import { create } from "../utils/simpleStore";

export const useKioskStore = create((set, get) => ({
  language: "en",
  department: null,
  service: null,

  // NEW
  token: "",

  // NEW
  ticket: null,

  citizen: {
    phone: "",
    verified: false,
  },

  formData: {},
  uploadedDocs: [],

  lastReceipt: null,

  lastActivity: Date.now(),

  setLanguage: (lang) => set({ language: lang }),
  setDepartment: (department) => set({ department }),
  setService: (service) => set({ service }),

  // NEW
  setToken: (token) => set({ token }),

  // NEW
  setTicket: (ticket) => set({ ticket }),

  setCitizenPhone: (phone) => set({ citizen: { ...get().citizen, phone } }),
  setCitizenVerified: (verified) =>
    set({ citizen: { ...get().citizen, verified } }),

  setFormData: (data) => set({ formData: data }),
  setUploadedDocs: (docs) => set({ uploadedDocs: docs }),

  setLastReceipt: (receipt) => set({ lastReceipt: receipt }),

  bumpActivity: () => set({ lastActivity: Date.now() }),

  resetSession: () =>
    set({
      department: null,
      service: null,

      token: "",
      ticket: null,

      citizen: { phone: "", verified: false },
      formData: {},
      uploadedDocs: [],
      lastReceipt: null,
      lastActivity: Date.now(),
    }),
}));
