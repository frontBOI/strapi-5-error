import type { Schema, Struct } from '@strapi/strapi'

export interface GeneralAddress extends Struct.ComponentSchema {
  collectionName: 'components_general_addresses'
  info: {
    displayName: 'Address'
    icon: 'house'
    description: ''
  }
  attributes: {
    city: Schema.Attribute.String
    country: Schema.Attribute.String
    line1: Schema.Attribute.String
    line2: Schema.Attribute.String
    zip_code: Schema.Attribute.Integer
  }
}

export interface CommandCommandElement extends Struct.ComponentSchema {
  collectionName: 'components_command_command_elements'
  info: {
    displayName: 'command-element'
    icon: 'archive'
  }
  attributes: {
    quantity: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1
        },
        number
      >
    product: Schema.Attribute.Relation<'oneToOne', 'api::product.product'>
  }
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'general.address': GeneralAddress
      'command.command-element': CommandCommandElement
    }
  }
}
