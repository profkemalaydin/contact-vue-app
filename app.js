const STORAGE_KEY = "vue_contact_app_v1";

const { createApp } = Vue;

createApp({
  data() {
    return {
      contacts: [],
      searchQuery: "",
      newContact: {
        name: "",
        email: "",
        phone: "",
        notes: "",
      },
    };
  },
  computed: {
    filteredContacts() {
      const q = this.searchQuery.trim().toLowerCase();
      if (!q) return this.contacts;

      return this.contacts.filter((c) => {
        const name = (c.name || "").toLowerCase();
        const email = (c.email || "").toLowerCase();
        return name.includes(q) || email.includes(q);
      });
    },
  },
  methods: {
    loadContacts() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.contacts = parsed;
        }
      } catch (err) {
        console.error("Failed to load contacts", err);
      }
    },
    saveContacts() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.contacts));
    },
    resetForm() {
      this.newContact = {
        name: "",
        email: "",
        phone: "",
        notes: "",
      };
    },
    addContact() {
      const name = this.newContact.name.trim();
      const email = this.newContact.email.trim();

      if (!name || !email) return;

      const contact = {
        id: Date.now().toString(),
        name,
        email,
        phone: this.newContact.phone.trim(),
        notes: this.newContact.notes.trim(),
        createdAt: new Date().toISOString(),
      };

      // Add to beginning of list
      this.contacts.unshift(contact);
      this.saveContacts();
      this.resetForm();
    },
    deleteContact(id) {
      this.contacts = this.contacts.filter((c) => c.id !== id);
      this.saveContacts();
    },
  },
  mounted() {
    this.loadContacts();
  },
}).mount("#app");
