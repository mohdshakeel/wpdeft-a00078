<?php
/*
 * Plugin Name: WPDEFT A00074
 * Version: 1.0
 * Plugin URI: https://wpdeft.com/
 * Description: Plugin to add styles of switch boxes
 * Author: MOHAMMAD
 * Author URI: https://wpdeft.com/
 */
add_action( 'init', function () {
$url = plugin_dir_url( __FILE__ );
wp_enqueue_script('wpdeft-form-data',$url . 'js/wpdeft.js',[ 'lfb-estimationpopup' ],'1.0');
wp_enqueue_style( 'wpdeft-switch', $url .'css/wpdeft.css',[ 'lfb-estimationpopup' ],'1.0');
if ( get_option( 'wpdeft_option_name' ) !== false ) {
wp_localize_script( 'wpdeft-form-data', 'wpdeft_params', array( 'shakeel_global_wpdeft' => get_option('wpdeft_option_name') ) );
}
});
add_action('admin_menu', 'add_menu_item_new');
function add_menu_item_new(){
add_submenu_page('lfb_menu', __('WP DEFT', 'lfb'), __('WP DEFT', 'lfb'), 'manage_options', 'lfb_global', 'wpdeft_options_page');
}
function wpdeft_options_page()
{
    $option_name = 'wpdeft_option_name' ;
	if(isset($_POST['wpdeft_option_name'])){
    $new_value = $_POST['wpdeft_option_name'];
	}

if ( get_option( $option_name ) !== false && isset($_POST['wpdeft_option_name']) ) {
   //echo 'shakeel-'.$new_value;
    // The option already exists, so we just update it.
    update_option( $option_name, $new_value );

} else {

    // The option hasn't been added yet. We'll add it with $autoload set to 'no'.
    $deprecated = null;
    $autoload = 'no';
    add_option( $option_name, $new_value, $deprecated, $autoload );
}?><div style="margin-left:20px;" >
  <h2>Global Feature</h2>
  <form method="post" action="admin.php?page=lfb_global">
  <?php settings_fields( 'wpdeft_options_group' ); ?>
 <table>
  <tr valign="top">
  <th scope="row"><label for="myplugin_option_name">Enable the global feature of form.</label></th>
  <td><?php $selected1 = (get_option('wpdeft_option_name')==0)?'selected=yes':'';
      $selected2 = (get_option('wpdeft_option_name')==1)?'selected=yes':''; ?>
<select name="wpdeft_option_name" > 
    <option value="0" <?php echo $selected1; ?> >No</option>
    <option value="1" <?php echo $selected2; ?> >Yes</option>
</select>

  </td>
  </tr>
  </table><?php  submit_button(); ?>
  </form>
  </div><?php } ?>


