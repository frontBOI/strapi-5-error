import type { Schema, Struct } from '@strapi/strapi'

export interface PluginUploadFile extends Struct.CollectionTypeSchema {
  collectionName: 'files'
  info: {
    singularName: 'file'
    pluralName: 'files'
    displayName: 'File'
    description: ''
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    'content-manager': {
      visible: false
    }
    'content-type-builder': {
      visible: false
    }
  }
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required
    alternativeText: Schema.Attribute.String
    caption: Schema.Attribute.String
    width: Schema.Attribute.Integer
    height: Schema.Attribute.Integer
    formats: Schema.Attribute.JSON
    hash: Schema.Attribute.String & Schema.Attribute.Required
    ext: Schema.Attribute.String
    mime: Schema.Attribute.String & Schema.Attribute.Required
    size: Schema.Attribute.Decimal & Schema.Attribute.Required
    url: Schema.Attribute.String & Schema.Attribute.Required
    previewUrl: Schema.Attribute.String
    provider: Schema.Attribute.String & Schema.Attribute.Required
    provider_metadata: Schema.Attribute.JSON
    related: Schema.Attribute.Relation<'morphToMany'>
    folder: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'> & Schema.Attribute.Private
    folderPath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.file'>
  }
}

export interface PluginUploadFolder extends Struct.CollectionTypeSchema {
  collectionName: 'upload_folders'
  info: {
    singularName: 'folder'
    pluralName: 'folders'
    displayName: 'Folder'
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    'content-manager': {
      visible: false
    }
    'content-type-builder': {
      visible: false
    }
  }
  attributes: {
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    pathId: Schema.Attribute.Integer & Schema.Attribute.Required & Schema.Attribute.Unique
    parent: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'>
    children: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.folder'>
    files: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.file'>
    path: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.folder'>
  }
}

export interface PluginI18NLocale extends Struct.CollectionTypeSchema {
  collectionName: 'i18n_locale'
  info: {
    singularName: 'locale'
    pluralName: 'locales'
    collectionName: 'locales'
    displayName: 'Locale'
    description: ''
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    'content-manager': {
      visible: false
    }
    'content-type-builder': {
      visible: false
    }
  }
  attributes: {
    name: Schema.Attribute.String &
      Schema.Attribute.SetMinMax<
        {
          min: 1
          max: 50
        },
        number
      >
    code: Schema.Attribute.String & Schema.Attribute.Unique
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'plugin::i18n.locale'>
  }
}

export interface PluginContentReleasesRelease extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_releases'
  info: {
    singularName: 'release'
    pluralName: 'releases'
    displayName: 'Release'
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    'content-manager': {
      visible: false
    }
    'content-type-builder': {
      visible: false
    }
  }
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required
    releasedAt: Schema.Attribute.DateTime
    scheduledAt: Schema.Attribute.DateTime
    timezone: Schema.Attribute.String
    status: Schema.Attribute.Enumeration<['ready', 'blocked', 'failed', 'done', 'empty']> & Schema.Attribute.Required
    actions: Schema.Attribute.Relation<'oneToMany', 'plugin::content-releases.release-action'>
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'plugin::content-releases.release'>
  }
}

export interface PluginContentReleasesReleaseAction extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_release_actions'
  info: {
    singularName: 'release-action'
    pluralName: 'release-actions'
    displayName: 'Release Action'
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    'content-manager': {
      visible: false
    }
    'content-type-builder': {
      visible: false
    }
  }
  attributes: {
    type: Schema.Attribute.Enumeration<['publish', 'unpublish']> & Schema.Attribute.Required
    contentType: Schema.Attribute.String & Schema.Attribute.Required
    entryDocumentId: Schema.Attribute.String
    locale: Schema.Attribute.String
    release: Schema.Attribute.Relation<'manyToOne', 'plugin::content-releases.release'>
    isEntryValid: Schema.Attribute.Boolean
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<'oneToMany', 'plugin::content-releases.release-action'>
  }
}

export interface PluginReviewWorkflowsWorkflow extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows'
  info: {
    name: 'Workflow'
    description: ''
    singularName: 'workflow'
    pluralName: 'workflows'
    displayName: 'Workflow'
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    'content-manager': {
      visible: false
    }
    'content-type-builder': {
      visible: false
    }
  }
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required & Schema.Attribute.Unique
    stages: Schema.Attribute.Relation<'oneToMany', 'plugin::review-workflows.workflow-stage'>
    contentTypes: Schema.Attribute.JSON & Schema.Attribute.Required & Schema.Attribute.DefaultTo<'[]'>
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'plugin::review-workflows.workflow'>
  }
}

export interface PluginReviewWorkflowsWorkflowStage extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows_stages'
  info: {
    name: 'Workflow Stage'
    description: ''
    singularName: 'workflow-stage'
    pluralName: 'workflow-stages'
    displayName: 'Stages'
  }
  options: {
    version: '1.1.0'
    draftAndPublish: false
  }
  pluginOptions: {
    'content-manager': {
      visible: false
    }
    'content-type-builder': {
      visible: false
    }
  }
  attributes: {
    name: Schema.Attribute.String
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#4945FF'>
    workflow: Schema.Attribute.Relation<'manyToOne', 'plugin::review-workflows.workflow'>
    permissions: Schema.Attribute.Relation<'manyToMany', 'admin::permission'>
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'plugin::review-workflows.workflow-stage'>
  }
}

export interface PluginUsersPermissionsPermission extends Struct.CollectionTypeSchema {
  collectionName: 'up_permissions'
  info: {
    name: 'permission'
    description: ''
    singularName: 'permission'
    pluralName: 'permissions'
    displayName: 'Permission'
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    'content-manager': {
      visible: false
    }
    'content-type-builder': {
      visible: false
    }
  }
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required
    role: Schema.Attribute.Relation<'manyToOne', 'plugin::users-permissions.role'>
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'plugin::users-permissions.permission'>
  }
}

export interface PluginUsersPermissionsRole extends Struct.CollectionTypeSchema {
  collectionName: 'up_roles'
  info: {
    name: 'role'
    description: ''
    singularName: 'role'
    pluralName: 'roles'
    displayName: 'Role'
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    'content-manager': {
      visible: false
    }
    'content-type-builder': {
      visible: false
    }
  }
  attributes: {
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3
      }>
    description: Schema.Attribute.String
    type: Schema.Attribute.String & Schema.Attribute.Unique
    permissions: Schema.Attribute.Relation<'oneToMany', 'plugin::users-permissions.permission'>
    users: Schema.Attribute.Relation<'oneToMany', 'plugin::users-permissions.user'>
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'plugin::users-permissions.role'>
  }
}

export interface PluginUsersPermissionsUser extends Struct.CollectionTypeSchema {
  collectionName: 'up_users'
  info: {
    name: 'user'
    description: ''
    singularName: 'user'
    pluralName: 'users'
    displayName: 'User'
  }
  options: {
    draftAndPublish: false
  }
  attributes: {
    username: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3
      }>
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6
      }>
    provider: Schema.Attribute.String
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6
      }>
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private
    confirmationToken: Schema.Attribute.String & Schema.Attribute.Private
    confirmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    blocked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    role: Schema.Attribute.Relation<'manyToOne', 'plugin::users-permissions.role'>
    firstname: Schema.Attribute.String & Schema.Attribute.Required
    lastname: Schema.Attribute.String & Schema.Attribute.Required
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'plugin::users-permissions.user'>
  }
}

export interface ApiAvisClientAvisClient extends Struct.CollectionTypeSchema {
  collectionName: 'avis_clients'
  info: {
    singularName: 'avis-client'
    pluralName: 'avis-clients'
    displayName: 'AvisClient'
  }
  options: {
    draftAndPublish: false
  }
  attributes: {
    client_name: Schema.Attribute.String & Schema.Attribute.Required
    avis: Schema.Attribute.Text & Schema.Attribute.Required
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::avis-client.avis-client'>
  }
}

export interface ApiClientClient extends Struct.CollectionTypeSchema {
  collectionName: 'clients'
  info: {
    singularName: 'client'
    pluralName: 'clients'
    displayName: 'Client'
    description: ''
  }
  options: {
    draftAndPublish: false
  }
  attributes: {
    firstname: Schema.Attribute.String & Schema.Attribute.Required
    lastname: Schema.Attribute.String
    commands: Schema.Attribute.Relation<'oneToMany', 'api::command.command'>
    address: Schema.Attribute.Component<'general.address', false>
    email: Schema.Attribute.Email
    phone: Schema.Attribute.String
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::client.client'>
  }
}

export interface ApiCodePromoCodePromo extends Struct.CollectionTypeSchema {
  collectionName: 'code_promos'
  info: {
    singularName: 'code-promo'
    pluralName: 'code-promos'
    displayName: 'CodePromo'
    description: ''
  }
  options: {
    draftAndPublish: false
  }
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required
    reduction: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMax<
        {
          min: 1
          max: 100
        },
        number
      >
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::code-promo.code-promo'>
  }
}

export interface ApiCoffretCoffret extends Struct.CollectionTypeSchema {
  collectionName: 'coffrets'
  info: {
    singularName: 'coffret'
    pluralName: 'coffrets'
    displayName: 'Coffret'
    description: ''
  }
  options: {
    draftAndPublish: false
  }
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required
    price: Schema.Attribute.Decimal & Schema.Attribute.Required
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required
    products: Schema.Attribute.Relation<'oneToMany', 'api::product.product'>
    description: Schema.Attribute.Text & Schema.Attribute.Required
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::coffret.coffret'>
  }
}

export interface ApiCommandCommand extends Struct.CollectionTypeSchema {
  collectionName: 'commands'
  info: {
    singularName: 'command'
    pluralName: 'commands'
    displayName: 'Command'
    description: ''
  }
  options: {
    draftAndPublish: false
  }
  attributes: {
    command_status: Schema.Attribute.Enumeration<['En cours', 'Livr\u00E9e', 'Annul\u00E9e']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'En cours'>
    date: Schema.Attribute.DateTime & Schema.Attribute.Required
    client: Schema.Attribute.Relation<'manyToOne', 'api::client.client'>
    elements: Schema.Attribute.Component<'command.command-element', true> & Schema.Attribute.Required
    mondial_relay_etiquette: Schema.Attribute.String
    mondial_relay_command_number: Schema.Attribute.String
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::command.command'>
  }
}

export interface ApiGlobalDataGlobalData extends Struct.SingleTypeSchema {
  collectionName: 'global_datas'
  info: {
    singularName: 'global-data'
    pluralName: 'global-datas'
    displayName: 'GlobalData'
    description: ''
  }
  options: {
    draftAndPublish: false
  }
  attributes: {
    tva_number: Schema.Attribute.String
    stripe_private_key: Schema.Attribute.String & Schema.Attribute.Required & Schema.Attribute.Private
    stripe_publishable_key: Schema.Attribute.String & Schema.Attribute.Required
    stripe_webhook_secret: Schema.Attribute.String & Schema.Attribute.Required & Schema.Attribute.Private
    mondial_relay_login_api: Schema.Attribute.String & Schema.Attribute.Required & Schema.Attribute.Private
    mondial_relay_password: Schema.Attribute.String & Schema.Attribute.Required & Schema.Attribute.Private
    gmail_oauth_refresh_token: Schema.Attribute.String & Schema.Attribute.Private
    mondial_relay_brand_id_api: Schema.Attribute.String & Schema.Attribute.Required
    elisa_minet_address: Schema.Attribute.Component<'general.address', true> & Schema.Attribute.Private
    elisa_minet_phone: Schema.Attribute.String & Schema.Attribute.Private
    tva_amount: Schema.Attribute.Integer & Schema.Attribute.Required & Schema.Attribute.DefaultTo<0>
    is_gmail_refresh_token_invalid: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::global-data.global-data'>
  }
}

export interface ApiPersonnalisationPersonnalisation extends Struct.SingleTypeSchema {
  collectionName: 'personnalisations'
  info: {
    singularName: 'personnalisation'
    pluralName: 'personnalisations'
    displayName: 'Personnalisation'
    description: ''
  }
  options: {
    draftAndPublish: false
  }
  attributes: {
    images_accueil: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required
    description_accueil: Schema.Attribute.Text & Schema.Attribute.Required
    a_propos_qui_sommes_nous: Schema.Attribute.Text & Schema.Attribute.Required
    a_propos_parfum_unique: Schema.Attribute.Text & Schema.Attribute.Required
    a_propos_qualite: Schema.Attribute.Text & Schema.Attribute.Required
    image_description_accueil: Schema.Attribute.Media<'images'> & Schema.Attribute.Required
    politique_de_remboursement: Schema.Attribute.Blocks & Schema.Attribute.Required
    mentions_legales: Schema.Attribute.Blocks & Schema.Attribute.Required
    conditions_generales: Schema.Attribute.Blocks & Schema.Attribute.Required
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::personnalisation.personnalisation'>
  }
}

export interface ApiProductProduct extends Struct.CollectionTypeSchema {
  collectionName: 'products'
  info: {
    singularName: 'product'
    pluralName: 'products'
    displayName: 'Product'
    description: ''
  }
  options: {
    draftAndPublish: false
  }
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required
    price: Schema.Attribute.Decimal & Schema.Attribute.Required
    images: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required
    conseils: Schema.Attribute.Text & Schema.Attribute.Required
    description: Schema.Attribute.Text & Schema.Attribute.Required
    ingredients: Schema.Attribute.Text & Schema.Attribute.Required
    category: Schema.Attribute.Enumeration<['Parfum', 'Soin du corps', 'Soin des cheveux']> & Schema.Attribute.Required
    coffret: Schema.Attribute.Relation<'manyToOne', 'api::coffret.coffret'>
    weight_in_grams: Schema.Attribute.Integer & Schema.Attribute.Required
    dermatologically_tested: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    made_in_france: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::product.product'>
  }
}

export interface ApiStripeSessionStripeSession extends Struct.CollectionTypeSchema {
  collectionName: 'stripe_sessions'
  info: {
    singularName: 'stripe-session'
    pluralName: 'stripe-sessions'
    displayName: 'StripeSession'
    description: ''
  }
  options: {
    draftAndPublish: false
  }
  attributes: {
    session_id: Schema.Attribute.String & Schema.Attribute.Required
    elements: Schema.Attribute.Component<'command.command-element', true> & Schema.Attribute.Required
    mondial_relay_parcel_id: Schema.Attribute.String
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::stripe-session.stripe-session'>
  }
}

export interface AdminPermission extends Struct.CollectionTypeSchema {
  collectionName: 'admin_permissions'
  info: {
    name: 'Permission'
    description: ''
    singularName: 'permission'
    pluralName: 'permissions'
    displayName: 'Permission'
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    'content-manager': {
      visible: false
    }
    'content-type-builder': {
      visible: false
    }
  }
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    actionParameters: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>
    subject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    properties: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>
    conditions: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<[]>
    role: Schema.Attribute.Relation<'manyToOne', 'admin::role'>
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::permission'>
  }
}

export interface AdminUser extends Struct.CollectionTypeSchema {
  collectionName: 'admin_users'
  info: {
    name: 'User'
    description: ''
    singularName: 'user'
    pluralName: 'users'
    displayName: 'User'
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    'content-manager': {
      visible: false
    }
    'content-type-builder': {
      visible: false
    }
  }
  attributes: {
    firstname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    lastname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    username: Schema.Attribute.String
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6
      }>
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6
      }>
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private
    registrationToken: Schema.Attribute.String & Schema.Attribute.Private
    isActive: Schema.Attribute.Boolean & Schema.Attribute.Private & Schema.Attribute.DefaultTo<false>
    roles: Schema.Attribute.Relation<'manyToMany', 'admin::role'> & Schema.Attribute.Private
    blocked: Schema.Attribute.Boolean & Schema.Attribute.Private & Schema.Attribute.DefaultTo<false>
    preferedLanguage: Schema.Attribute.String
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::user'>
  }
}

export interface AdminRole extends Struct.CollectionTypeSchema {
  collectionName: 'admin_roles'
  info: {
    name: 'Role'
    description: ''
    singularName: 'role'
    pluralName: 'roles'
    displayName: 'Role'
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    'content-manager': {
      visible: false
    }
    'content-type-builder': {
      visible: false
    }
  }
  attributes: {
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    description: Schema.Attribute.String
    users: Schema.Attribute.Relation<'manyToMany', 'admin::user'>
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::permission'>
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::role'>
  }
}

export interface AdminApiToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_tokens'
  info: {
    name: 'Api Token'
    singularName: 'api-token'
    pluralName: 'api-tokens'
    displayName: 'Api Token'
    description: ''
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    'content-manager': {
      visible: false
    }
    'content-type-builder': {
      visible: false
    }
  }
  attributes: {
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }> &
      Schema.Attribute.DefaultTo<''>
    type: Schema.Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'read-only'>
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    lastUsedAt: Schema.Attribute.DateTime
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::api-token-permission'>
    expiresAt: Schema.Attribute.DateTime
    lifespan: Schema.Attribute.BigInteger
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'>
  }
}

export interface AdminApiTokenPermission extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_token_permissions'
  info: {
    name: 'API Token Permission'
    description: ''
    singularName: 'api-token-permission'
    pluralName: 'api-token-permissions'
    displayName: 'API Token Permission'
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    'content-manager': {
      visible: false
    }
    'content-type-builder': {
      visible: false
    }
  }
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    token: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::api-token-permission'>
  }
}

export interface AdminTransferToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_tokens'
  info: {
    name: 'Transfer Token'
    singularName: 'transfer-token'
    pluralName: 'transfer-tokens'
    displayName: 'Transfer Token'
    description: ''
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    'content-manager': {
      visible: false
    }
    'content-type-builder': {
      visible: false
    }
  }
  attributes: {
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }> &
      Schema.Attribute.DefaultTo<''>
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    lastUsedAt: Schema.Attribute.DateTime
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::transfer-token-permission'>
    expiresAt: Schema.Attribute.DateTime
    lifespan: Schema.Attribute.BigInteger
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::transfer-token'>
  }
}

export interface AdminTransferTokenPermission extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_token_permissions'
  info: {
    name: 'Transfer Token Permission'
    description: ''
    singularName: 'transfer-token-permission'
    pluralName: 'transfer-token-permissions'
    displayName: 'Transfer Token Permission'
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    'content-manager': {
      visible: false
    }
    'content-type-builder': {
      visible: false
    }
  }
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    token: Schema.Attribute.Relation<'manyToOne', 'admin::transfer-token'>
    createdAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::transfer-token-permission'>
  }
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ContentTypeSchemas {
      'plugin::upload.file': PluginUploadFile
      'plugin::upload.folder': PluginUploadFolder
      'plugin::i18n.locale': PluginI18NLocale
      'plugin::content-releases.release': PluginContentReleasesRelease
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction
      'plugin::review-workflows.workflow': PluginReviewWorkflowsWorkflow
      'plugin::review-workflows.workflow-stage': PluginReviewWorkflowsWorkflowStage
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission
      'plugin::users-permissions.role': PluginUsersPermissionsRole
      'plugin::users-permissions.user': PluginUsersPermissionsUser
      'api::avis-client.avis-client': ApiAvisClientAvisClient
      'api::client.client': ApiClientClient
      'api::code-promo.code-promo': ApiCodePromoCodePromo
      'api::coffret.coffret': ApiCoffretCoffret
      'api::command.command': ApiCommandCommand
      'api::global-data.global-data': ApiGlobalDataGlobalData
      'api::personnalisation.personnalisation': ApiPersonnalisationPersonnalisation
      'api::product.product': ApiProductProduct
      'api::stripe-session.stripe-session': ApiStripeSessionStripeSession
      'admin::permission': AdminPermission
      'admin::user': AdminUser
      'admin::role': AdminRole
      'admin::api-token': AdminApiToken
      'admin::api-token-permission': AdminApiTokenPermission
      'admin::transfer-token': AdminTransferToken
      'admin::transfer-token-permission': AdminTransferTokenPermission
    }
  }
}
