export default {
  common: {
    yes: "Ok",
    no: "No",
    send: "Send",
    goBack: "Go Back",
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    cancel: "Annuler",
    loading: "Chargement",
    EXTERNAL: "Externe",
    INTERNAL: "Interne",
    ADMIN: "Admin",
    caution: "Attention !",
    add: "Ajouter",
    update: "Mettre à jour",
    select: "Sélectionner",
    disable: "Désactiver",
    enable: "Activer",
    disabled: "Désactivé",
    enabled: "Activé",
    error: {
      anErrorOccurredPleaseRetryLater: "Une erreur est survenue réessaie plus tard"
    }
  },
  signIn: {
    welcome: "Bienvenue",
    continueWithMicrosoft: "Continuer avec Microsoft",
    continue: "Continuer",
    email: "Email",
    emailPlaceholder: "email@address.com",
    password: "Mot de passe",
    forgotPassword: "Mot de passe oublié ?",
    or: "ou"
  },
  home: {
    welcomeMessage: "Hello",
  },
  changeTemporaryPassword: {
    changeTemporaryPassword: "Changement du mot de passe temporaire",
    oldPassword: "Ancien mot de passe",
    newPassword: "Nouveau mot de passe",
    confirmPassword: "Confirmation du mot de passe",
    submit: "Valider",
    bitwardenSuggestion: "Pour garantir un bon niveau de sécurité, nous vous invitons à utiliser un gestionnaire de mots de passe tel que <linkText>Bitwarden</linkText>",
  },
  forgotPassword: {
    emailLabel: "Email",
    email: "Email",
    emailPlaceholder: "email@address.com",
    submit: "Valider",
    cancel: "Annuler",
    forgotPassword: "Mot de passe oublié ?"
  },
  admin: {
    craManagement: "Gestion des CRA",
    validation: "Validation",
    submission: "Soumission",
    general: "Général",
    management: "Gestion",
    customers: "Clients",
    users: "Utilisateurs",
    invoicing: "Facturation",
    toggleColorScheme: "Changer le thème",
    confirmEnableMaintenanceMode: "Êtes-vous sûr(e) de vouloir activer le mode maintenance ?",
    confirmDisableMaintenanceMode: "Êtes-vous sûr(e) de vouloir désactiver le mode maintenance ?",
    enableMaintenanceDescription: "Ceci retirera l'accès à Crakotte pour tous les utilisateurs",
    disableMaintenanceDescription: "Ceci rétablira l'accès à Crakotte pour tous les utilisateurs",
    maintenanceMode: "Mode maintenance",
  },
  customers: {
    customers: "Clients",
    addACustomer: "Ajouter un client",
    editCustomer: "Modifier le client {{customer}}",
    name: "Nom",
    logo: "Logo",
    contactEmail: "Email de contact",
    imageLimit: "L'image ne doit pas dépasser 5 Mo",
    projects: "Projets",
    addProject: "Ajouter le projet \"{{name}}\"",
    typeToAddProject: "Écrivez pour ajouter un project",
    enterToAdd: "Tappez sur la toucher Enter pour ajouter",
    noCustomersFound: "Aucun client trouvé",
    noEmail: "Aucun email",
    modalConfirmDeleteTitle: "Êtes-vous sûr(e) de vouloir supprimer le client '{{clientName}}' ? Cette action est irréversible.",
    customerDeletion: "Suppression d'un client",
    cantDeleteCustomer: "Impossible de supprimer le client"
  },
  user: {
    search: {
      filters: "Filters",
      clearAll: "Clear All",
      search: "Search",
      categories: "Categories",
      allCategories: "All categories",
      results: "Results"
    },
    menu: {
      messages: "Messages",
      favorites: "Favourites",
      track: "Track transactions",
      history: "History",
      settings: "Settings",
    }
  },
  maintenance: {
    description: "Notre équipe a besoin de faire quelques réglages, mais pas d'inquiétudes ils vont assurer 😃"
  },
  form: {
    passwordRules: "Le mot de passe doit contenir au moins 6 caractères dont une majuscule, une minuscule, un chiffre et un caractère spécial.",
    includesAtLeast6Characters: "Contient au moins 6 caractères",
    includesNumber: "Contient un chiffre",
    includesLowercaseLetter: "Contient une lettre minuscule",
    includesUppercaseLetter: "Contient une lettre majuscule",
    includesSpecialSymbol: "Contient un caractère spécial",
    error: {
      required: "Requis",
      invalidEmail: "Email invalide",
      passwordsDontMatch: "Les mots de passe ne correspondent pas",
    }
  }
}
