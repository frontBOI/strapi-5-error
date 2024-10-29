import * as React from 'react'

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section, // @ts-ignore
  Tailwind,
  Text,
} from '@react-email/components'

import Fonts from '../Fonts'

interface QuantifiableElement<T> {
  element: T
  quantity: number
}

interface Props {
  date: string
  commandId: string
  clientFirstName: string
  elements: QuantifiableElement<any>[]
}

export default function CommandSuccessful({
  commandId = '129',
  clientFirstName = 'Mathieu',
  date = new Date().toLocaleDateString('fr-FR'),
  elements = [{ quantity: 2, element: { name: 'qqchose' } }],
}: Props) {
  const previewText = `Merci pour votre commande, ${clientFirstName}.`

  return (
    <Html>
      <Head>
        <Fonts />
      </Head>

      <Preview>{previewText}</Preview>

      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[550px]">
            <Heading className="text-black text-[24px] font-bold text-center p-0 mb-[30px] mx-0">
              Commande #{commandId} confirmée
            </Heading>

            <Section className="my-[50px]">
              <Img
                alt="Logo"
                width="100"
                height="100"
                className="my-0 mx-auto"
                src={`https://tesnim.fr/img/logo.png`}
              />
            </Section>

            <Text className="text-black text-[14px] leading-[24px]">
              TESNIM Cosmétique vous remercie pour votre achat. Nous préparons l&apos;envoi de votre commande dans les
              plus brefs délais.
            </Text>

            <Text className="text-black text-[14px] leading-[24px]">Voici le détail de votre commande du {date}:</Text>

            {elements.map(({ element, quantity }, i) => (
              <Text className="text-black text-[14px] leading-[24px]" key={i}>
                - {element.name} x{quantity}
              </Text>
            ))}

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

            <Text className="text-[#7b7b7b] text-[12px] leading-[24px]">
              Si vous avez des questions, contactez nous <a href="https://tesnim.fr/contact">en cliquant ici</a>, ou sur
              le site <a href="https://tesnim.fr">tesnim.fr</a> dans la rubrique nous contacter.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
