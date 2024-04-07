<template>
  <StackLayout>
    <Label textWrap="true">
      <FormattedString>
        <Span text="Codigo de Pallet: " fontWeight="bold" fontSize="14" />
        <Span :text="infoPallet.code + '\n'" fontSize="14" />
      </FormattedString>
    </Label>
    <Stripe color="#3c495e" ml="0" mr="0" />
  </StackLayout>
</template>
<script>
export default {};
</script>
