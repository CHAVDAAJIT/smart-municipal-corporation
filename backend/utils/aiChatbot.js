const responses = {
  // Greetings
  greetings: {
    keywords: ["hello", "hi", "hey", "namaskar", "namaste", "good morning", "good evening"],
    response: "👋 Hello! Welcome to Smart Municipal Corporation. How can I help you today?\n\nI can help you with:\n• 📋 Complaint registration\n• 💧 Water supply issues\n• 🚛 Garbage collection\n• 🏠 Property tax\n• 📄 Certificates\n• 🔔 Notifications"
  },

  // Complaints
  complaint: {
    keywords: ["complaint", "register complaint", "issue", "problem", "report"],
    response: "📋 To register a complaint:\n1. Go to 'Complaint Register' in sidebar\n2. Select complaint type\n3. Fill area and description\n4. Add photos (optional)\n5. Submit!\n\nYou'll earn ⭐ 10 points for each complaint!"
  },

  // Complaint status
  complaintStatus: {
    keywords: ["complaint status", "my complaint", "track complaint", "complaint progress"],
    response: "🔍 To track your complaint:\n1. Go to 'My Complaints' in sidebar\n2. Click '📋 Timeline' button\n3. See full activity timeline\n\nStatus flow: Pending → Assigned → Resolved"
  },

  // Water
  water: {
    keywords: ["water", "water supply", "no water", "water issue", "tanker", "water problem"],
    response: "💧 For water related issues:\n• View supply schedule in Water Management\n• Register water complaint\n• Request water tanker\n• Check outage alerts\n\nGo to: Dashboard → Water Management"
  },

  // Garbage
  garbage: {
    keywords: ["garbage", "trash", "waste", "dustbin", "cleaning", "sweeping"],
    response: "🚛 For garbage related issues:\n• Track garbage trucks on map\n• Register garbage complaint\n• Check collection schedule\n\nGo to: Dashboard → Garbage Truck Tracking"
  },

  // Property Tax
  tax: {
    keywords: ["property tax", "tax", "tax payment", "pay tax", "tax amount"],
    response: "🏠 For property tax:\n1. Go to Property Tax in sidebar\n2. Enter your Property ID (e.g. PROP-001)\n3. View tax details\n4. Pay online!\n\n💡 Use your points for discount:\n100 points = ₹1 off on tax!"
  },

  // Certificate
  certificate: {
    keywords: ["certificate", "birth certificate", "death certificate", "income certificate", "document"],
    response: "📄 To apply for certificate:\n1. Go to 'Documents Service'\n2. Select certificate type:\n   • 🍼 Birth Certificate\n   • 🕊️ Death Certificate\n   • 💼 Income Certificate\n3. Fill details & upload documents\n4. Submit request!\n\nAdmin will approve within 3-5 working days."
  },

  // Points
  points: {
    keywords: ["points", "reward", "earn points", "redeem", "leaderboard"],
    response: "⭐ Points & Rewards System:\n\n🎯 How to earn:\n• Register complaint = +10 points\n• Admin bonus = +10 to +100 points\n\n💰 Redeem:\n• 100 points = ₹1 discount on tax\n\nGo to: Dashboard → My Points & Rewards"
  },

  // Login issues
  login: {
    keywords: ["login", "password", "forgot password", "can't login", "account"],
    response: "🔐 Login issues?\n\n• Forgot password → Click 'Forgot Password?' on login page\n• Enter your email\n• Get OTP\n• Reset password\n\nStill facing issues? Chat with our admin team!"
  },

  // Announcements
  announcement: {
    keywords: ["announcement", "news", "updates", "notice", "event"],
    response: "📢 Stay updated!\n\n• Go to 'Event Announcements' for latest notices\n• Visit 'City Updates' for city news\n• Check 'Notifications' for your alerts"
  },

  // Hours
  hours: {
    keywords: ["timing", "office hours", "working hours", "time", "open"],
    response: "🕐 Office Timings:\n• Monday-Friday: 9 AM - 6 PM\n• Saturday: 9 AM - 2 PM\n• Sunday: Closed\n\n✅ Online portal available 24/7!"
  },

  // Contact
  contact: {
    keywords: ["contact", "phone", "email", "address", "helpline"],
    response: "📞 Contact Information:\n\n📱 Phone: +91 79 2234 5678\n📧 Email: admin@smartmunicipal.gov.in\n🆘 Helpline: 1800-XXX-XXXX (Toll Free)\n\n🏢 Office: Municipal Corporation Office,\nSardar Patel Bhavan, Ahmedabad - 380001"
  },

  // Thanks
  thanks: {
    keywords: ["thank", "thanks", "thank you", "धन्यवाद", "shukriya"],
    response: "😊 You're welcome! Is there anything else I can help you with?\n\nFor complex issues, please connect with our admin team using the 'Live Chat' option!"
  },

  // Default
  default: "🤔 I'm not sure I understood that. Let me connect you with our support team!\n\nYou can also try asking about:\n• Complaint registration\n• Water supply\n• Property tax\n• Certificates\n• Points & rewards\n• Office timings"
};

exports.getBotResponse = (message) => {
  const lowerMsg = message.toLowerCase();

  for (const [key, data] of Object.entries(responses)) {
    if (key === "default") continue;
    if (data.keywords.some(kw => lowerMsg.includes(kw))) {
      return data.response;
    }
  }

  return responses.default;
};