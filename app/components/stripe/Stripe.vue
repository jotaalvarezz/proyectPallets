<template lang="">
  <StackLayout
    :backgroundColor="color"
    style="height: 1px; margin: 10px 20px 10px 20px"
  ></StackLayout>
</template>

<script>
export default {
    props:{
        color:{
            type: String,
            default:'#3c495e'
        }
    }
}
</script>
