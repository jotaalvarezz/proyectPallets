<template lang="">
  <StackLayout
    :backgroundColor="color"
    :marginTop="mt"
    :marginRight="mr"
    :marginBottom="mb"
    :marginLeft="ml"
    style="height: 1px;"
  ></StackLayout>
</template>

<script>
export default {
    name:"Stripe",
    props:{
        color:{
            type: String,
            default:'#3c495e'
        },
        mt:{
          type: Number,
          default: 10
        },
        mr:{
          type: Number,
          default: 20
        },
        mb:{
          type: Number,
          default: 10
        },
        ml:{
          type: Number,
          default: 20
        },
    }
}
</script>
