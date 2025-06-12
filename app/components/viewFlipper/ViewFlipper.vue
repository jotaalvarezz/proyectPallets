<template>
  <!-- <Page> -->
    <!--     <Header :search="false" /> -->
    <ActionBar title="Registro de Tiendas">
      <ActionItem
        @tap="prev"
        ios.systemIcon="13"
        android.systemIcon="ic_media_previous"
        ios.position="left"
        android.position="actionBar"
      />
      <ActionItem
        @tap="next"
        ios.systemIcon="14"
        android.systemIcon="ic_media_next"
        ios.position="right"
        android.position="actionBar"
      />
    </ActionBar>
  <!-- </Page> -->
</template>
<script>
export default {
  name: "View-Flipper",
};
</script>
