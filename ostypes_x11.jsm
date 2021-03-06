var EXPORTED_SYMBOLS = ['ostypes'];

// no need to define core or import cutils as all the globals of the worker who importScripts'ed it are availble here

if (ctypes.voidptr_t.size == 4 /* 32-bit */) {
	var is64bit = false;
} else if (ctypes.voidptr_t.size == 8 /* 64-bit */) {
	var is64bit = true;
} else {
	throw new Error('huh??? not 32 or 64 bit?!?!');
}

var xlibTypes = function() {
	// ABIs
	this.CALLBACK_ABI = ctypes.default_abi;
	this.ABI = ctypes.default_abi;

	///// C TYPES
	// SIMPLE TYPES
	this.char = ctypes.char;
	this.fd_set = ctypes.uint8_t; // This is supposed to be fd_set*, but on Linux at least fd_set is just an array of bitfields that we handle manually. this is for my fd_set_set helper functions link4765403
	this.int = ctypes.int;
	this.int16_t = ctypes.int16_t;
	this.long = ctypes.long;
	this.size_t = ctypes.size_t;
	this.unsigned_char = ctypes.unsigned_char;
	this.unsigned_int = ctypes.unsigned_int;
	this.unsigned_long = ctypes.unsigned_long;
	this.uint16_t = ctypes.uint16_t;
	this.uint32_t = ctypes.uint32_t;
	this.uint8_t = ctypes.uint8_t;
	this.void = ctypes.void_t;

	// SIMPLE STRUCTS
	this.timeval = ctypes.StructType('timeval', [
		{ 'tv_sec': this.long },
		{ 'tv_usec': this.long }
	]);

	///// X11 TYPES
	// SIMPLE TYPES // http://refspecs.linuxfoundation.org/LSB_1.3.0/gLSB/gLSB/libx11-ddefs.html
	this.Atom = ctypes.unsigned_long;
	this.Bool = ctypes.int;
	this.KeyCode = ctypes.unsigned_char;
	this.Status = ctypes.int;
	this.Time = ctypes.unsigned_long;
	this.VisualID = ctypes.unsigned_long;
	this.XID = ctypes.unsigned_long;
	this.XPointer = ctypes.char.ptr;
	this.CARD32 = /^(Alpha|hppa|ia64|ppc64|s390|x86_64)-/.test(core.os.xpcomabi) ? this.unsigned_int : this.unsigned_long; // https://github.com/foudfou/FireTray/blob/a0c0061cd680a3a92b820969b093cc4780dfb10c/src/modules/ctypes/linux/x11.jsm#L45 // // http://mxr.mozilla.org/mozilla-central/source/configure.in
	this.RROutput = this.XID;
	this.Connection = ctypes.uint16_t; // not exactly sure about this one but its working
	this.SubpixelOrder = ctypes.uint16_t; // not exactly sure about this one but its working
	this.RRCrtc = this.XID;
	this.RRMode = this.XID;
	this.XRRModeFlags = ctypes.unsigned_long;
	this.Rotation = ctypes.uint16_t; // not exactly sure about this one but its working

	// ADVANCED TYPES
	this.Colormap = this.XID;
	this.Cursor = this.XID;
	this.Drawable = this.XID;
	this.Font = this.XID;
	this.GContext = this.XID;
	this.KeySym = this.XID;
	this.Pixmap = this.XID;
	this.Window = this.XID;

	// OPAQE STRUCTS
	this.Screen = ctypes.StructType('Screen');
	this.Display = ctypes.StructType('Display');
	this.Visual = ctypes.StructType('Visual');
	this.Depth = ctypes.StructType('Depth');

	// SIMPLE STRUCTS
	this.XButtonEvent = ctypes.StructType('XButtonEvent', [ // http://tronche.com/gui/x/xlib/events/keyboard-pointer/keyboard-pointer.html#XButtonEvent
		{ type: this.int },
		{ serial: this.unsigned_long },
		{ send_event: this.Bool },
		{ display: this.Display.ptr },
		{ window: this.Window },
		{ root: this.Window },
		{ subwindow: this.Window },
		{ time: this.Time },
		{ x: this.int },
		{ y: this.int },
		{ x_root: this.int },
		{ y_root: this.int },
		{ state: this.unsigned_int },
		{ button: this.unsigned_int },
		{ same_screen: this.Bool }
	]);
	this.XClientMessageEvent = ctypes.StructType('XClientMessageEvent', [ // http://www.man-online.org/page/3-XClientMessageEvent/
		{ type: this.int },				// ClientMessage
		{ serial: this.unsigned_long },	// # of last request processed by server
		{ send_event: this.Bool },		// true if this came from a SendEvent request
		{ display: this.Display.ptr },	// Display the event was read from
		{ window: this.Window },
		{ message_type: this.Atom },
		{ format: this.int },
		{ data: this.long.array(5) }	// union of either this.char.array(20), this.short.array(10), or this.long.array(5) // if go with long format must be set to 32, if short then 16 else if char then 8
	]);
	this.XImage = ctypes.StructType('_XImage', [	// https://github.com/pombreda/rpythonic/blob/23857bbeda30a4574b7ae3a3c47e88b87080ef3f/examples/xlib/__init__.py#L1593
		{ width: this.int },
		{ height: this.int },						// size of image
		{ xoffset: this.int },						// number of pixels offset in X direction
		{ format: this.int },						// XYBitmap, XYPixmap, ZPixmap
		{ data: this.char.ptr },					// pointer to image data
		{ byte_order: this.int },					// data byte order, LSBFirst, MSBFirst
		{ bitmap_unit: this.int },					// quant. of scanline 8, 16, 32
		{ bitmap_bit_order: this.int },				// LSBFirst, MSBFirst
		{ bitmap_pad: this.int },					// 8, 16, 32 either XY or ZPixmap
		{ depth: this.int },						// depth of image
		{ bytes_per_line: this.int },				// accelerator to next scanline
		{ bits_per_pixel: this.int },				// bits per pixel (ZPixmap)
		{ red_mask: this.unsigned_long },			// bits in z arrangement
		{ green_mask: this.unsigned_long },
		{ blue_mask: this.unsigned_long },
		{ obdata: this.XPointer },					// hook for the object routines to hang on
		{
			f: ctypes.StructType('funcs', [			// image manipulation routines
				{ create_image: ctypes.voidptr_t },
				{ destroy_image: ctypes.voidptr_t },
				{ get_pixel: ctypes.voidptr_t },
				{ put_pixel: ctypes.voidptr_t },
				{ sub_image: ctypes.voidptr_t },
				{ add_pixel: ctypes.voidptr_t }
			])
		}
	]);
	this.XKeyEvent = ctypes.StructType('XKeyEvent', [ // https://tronche.com/gui/x/xlib/events/keyboard-pointer/keyboard-pointer.html#XKeyEvent
		{ type: this.int },
		{ serial: this.unsigned_long },
		{ send_event: this.Bool },
		{ display: this.Display.ptr },
		{ window: this.Window },
		{ root: this.Window },
		{ subwindow: this.Window },
		{ time: this.Time },
		{ x: this.int },
		{ y: this.int },
		{ x_root: this.int },
		{ y_root: this.int },
		{ state: this.unsigned_int },
		{ keycode: this.unsigned_int },
		{ same_screen: this.Bool }
	]);
	this.XTextProperty = ctypes.StructType('XTextProperty', [
		{ value: this.unsigned_char.ptr },	// *value
		{ encoding: this.Atom },			// encoding
		{ format: this.int },				// format
		{ nitems: this.unsigned_long }		// nitems
	]);
	this.XWindowAttributes = ctypes.StructType('XWindowAttributes', [
		{ x: this.int },
		{ y: this.int },							// location of window
		{ width: this.int },
		{ height: this.int },						// width and height of window
		{ border_width: this.int },					// border width of window
		{ depth: this.int },						// depth of window
		{ visual: this.Visual.ptr },				// the associated visual structure
		{ root: this.Window },						// root of screen containing window
		{ class: this.int },						// InputOutput, InputOnl
		{ bit_gravity: this.int },					// one of bit gravity values
		{ win_gravity: this.int },					// one of the window gravity values
		{ backing_store: this.int },				// NotUseful, WhenMapped, Always
		{ backing_planes: this.unsigned_long },		// planes to be preserved if possible
		{ backing_pixel: this.unsigned_long },		// value to be used when restoring planes
		{ save_under: this.Bool },					// boolean, should bits under be saved?
		{ colormap: this.Colormap },				// color map to be associated with window
		{ map_installed: this.Bool },				// boolean, is color map currently installe
		{ map_state: this.int },					// IsUnmapped, IsUnviewable, IsViewable
		{ all_event_masks: this.long },				// set of events all people have interest i
		{ your_event_mask: this.long },				// my event mask
		{ do_not_propagate_mask: this.long },		// set of events that should not propagate
		{ override_redirect: this.Bool },			// boolean value for override-redirect
		{ screen: this.Screen.ptr }					// back pointer to correct screen
	]);

	// ADVANCED STRUCTS
	// XEvent is one huge union, js-ctypes doesnt have union so i just set it to what I use for my addon
	this.XEvent = ctypes.StructType('_XEvent', [ // http://tronche.com/gui/x/xlib/events/structures.html
		{ xclient: this.XClientMessageEvent }
		// { xbutton: this.XButtonEvent }
		// { xkey: this.XKeyEvent }
	]);

	// start - xrandr stuff
		// resources:
		// http://cgit.freedesktop.org/xorg/proto/randrproto/tree/randrproto.txt
		// http://www.xfree86.org/current/Xrandr.3.html
	this.XRRModeInfo = ctypes.StructType('_XRRModeInfo', [
		{ id: this.RRMode },
		{ width: this.unsigned_int },
		{ height: this.unsigned_int },
		{ dotClock: this.unsigned_long },
		{ hSyncStart: this.unsigned_int },
		{ hSyncEnd: this.unsigned_int },
		{ hTotal: this.unsigned_int },
		{ hSkew: this.unsigned_int },
		{ vSyncStart: this.unsigned_int },
		{ vSyncEnd: this.unsigned_int },
		{ vTotal: this.unsigned_int },
		{ name: this.char.ptr },
		{ nameLength: this.unsigned_int },
		{ modeFlags: this.XRRModeFlags }
	]);

	this.XRRScreenResources = ctypes.StructType('_XRRScreenResources', [
		{ timestamp: this.Time },
		{ configTimestamp: this.Time },
		{ ncrtc: this.int },
		{ crtcs: this.RRCrtc.ptr },
		{ noutput: this.int },
		{ outputs: this.RROutput.ptr },
		{ nmode: this.int },
		{ modes: this.XRRModeInfo.ptr }
	]);

	this.XRROutputInfo = ctypes.StructType('_XRROutputInfo', [
		{ timestamp: this.Time },
		{ crtc: this.RRCrtc },
		{ name: this.char.ptr },
		{ nameLen: this.int },
		{ mm_width: this.unsigned_long },
		{ mm_height: this.unsigned_long },
		{ connection: this.Connection },
		{ subpixel_order: this.SubpixelOrder },
		{ ncrtc: this.int },
		{ crtcs: this.RRCrtc.ptr },
		{ nclone: this.int },
		{ clones: this.RROutput.ptr },
		{ nmode: this.int },
		{ npreferred: this.int },
		{ modes: this.RRMode.ptr }
	]);

	this.XRRCrtcInfo = ctypes.StructType('_XRRCrtcInfo', [
		{ timestamp: this.Time },
		{ x: this.int },
		{ y: this.int },
		{ width: this.unsigned_int },
		{ height: this.unsigned_int },
		{ mode: this.RRMode },
		{ rotation: this.Rotation },
		{ noutput: this.int },
		{ outputs: this.RROutput.ptr },
		{ rotations: this.Rotation },
		{ npossible: this.int },
		{ possible: this.RROutput.ptr }
	]);

	/////////////// GTK stuff temporary for test, i want to use x11 for everything
	// SIMPLE TYPES
	this.CARD32 = /^(Alpha|hppa|ia64|ppc64|s390|x86_64)-/.test(core.os.xpcomabi) ? ctypes.unsigned_int : ctypes.unsigned_long;
	this.gchar = ctypes.char;
	this.GAppInfo = ctypes.StructType('GAppInfo');
	this.GAppLaunchContext = ctypes.StructType('GAppLaunchContext');
	this.GBytes = ctypes.StructType('_GBytes');
	this.GCancellable = ctypes.StructType('_GCancellable');
	this.GdkColormap = ctypes.StructType('GdkColormap');
	this.GDesktopAppInfo = ctypes.StructType('GDesktopAppInfo');
	this.GdkDisplay = ctypes.StructType('GdkDisplay');
	this.GdkDisplayManager = ctypes.StructType('GdkDisplayManager');
	this.GdkDrawable = ctypes.StructType('GdkDrawable');
	this.GdkEventMask = ctypes.int; // enum, guessing enum is int
	this.GdkFilterReturn = ctypes.int; // enum, guessing enum is int
	this.GdkFullscreenMode = ctypes.int;
	this.GdkGravity = ctypes.int;
	this.GdkPixbuf = ctypes.StructType('GdkPixbuf');
	this.GdkScreen = ctypes.StructType('GdkScreen');
	this.GdkWindow = ctypes.StructType('GdkWindow');
	this.GdkWindowHints = ctypes.int;
	this.GdkWindowTypeHint = ctypes.int;
	this.gdouble = ctypes.double;
	this.GFile = ctypes.StructType('_GFile');
	this.GFileMonitor = ctypes.StructType('_GFileMonitor');
	this.gint = ctypes.int;
	this.gpointer = ctypes.void_t.ptr;
	this.GtkWidget = ctypes.StructType('GtkWidget');
	this.GtkWindow = ctypes.StructType('GtkWindow');
	this.GtkWindowPosition = ctypes.int;
	this.guchar = ctypes.unsigned_char;
	this.guint = ctypes.unsigned_int;
	this.guint32 = ctypes.unsigned_int;
	this.gulong = ctypes.unsigned_long;

	// ADVANCED TYPES // defined by "simple types"
	this.gboolean = this.gint;
	this.GQuark = this.guint32;

	///
	this.GdkXEvent = this.XEvent;
	//this.GdkEvent = ctypes.StructType('GdkEvent', [

	//]);
	this.GdkEvent = ctypes.void_t;

	// SIMPLE STRUCTS
	this.GError = new ctypes.StructType('GError', [
		{'domain': this.GQuark},
		{'code': ctypes.int},
		{'message': ctypes.char.ptr}
	]);
	this.GList = new ctypes.StructType('GList', [
		{'data': ctypes.voidptr_t},
		{'next': ctypes.voidptr_t},
		{'prev': ctypes.voidptr_t}
	]);

	// FUNCTION TYPES
	this.GdkFilterFunc = ctypes.FunctionType(this.CALLBACK_ABI, this.GdkFilterReturn, [this.GdkXEvent.ptr, this.GdkEvent.ptr, this.gpointer]).ptr; // https://developer.gnome.org/gdk3/stable/gdk3-Windows.html#GdkFilterFunc
	// end - gtk

	/////////////// XCB stuff
	// SIMPLE TYPES
	// lots of types i cant find out there are found here file:///C:/Users/Vayeate/Downloads/xcb%20types/libxcb-1.9/doc/tutorial/index.html BUT this i am realizing is just from xproto.h - https://github.com/netzbasis/openbsd-xenocara/blob/e6500f41b55e38013ac9b489f66fe49df6b8b68c/lib/libxcb/src/xproto.h#L453
	this.xcb_atom_t = this.uint32_t;
	this.xcb_colormap_t = this.uint32_t;
	this.xcb_drawable_t = this.uint32_t;
	this.xcb_keycode_t = this.uint8_t;
	this.xcb_keysym_t = this.uint32_t; // https://github.com/netzbasis/openbsd-xenocara/blob/e6500f41b55e38013ac9b489f66fe49df6b8b68c/lib/libxcb/src/xproto.h#L159
	this.xcb_randr_crtc_t = this.uint32_t;
	this.xcb_randr_mode_t = this.uint32_t;
	this.xcb_randr_output_t = this.uint32_t;
	this.xcb_timestamp_t = this.uint32_t;
	this.xcb_visualid_t = this.uint32_t;
	this.xcb_window_t = this.uint32_t;

	// SIMPLE STRUCTS
	this.xcb_client_message_data_t = ctypes.StructType('xcb_client_message_data_t', [ // union - https://xcb.freedesktop.org/manual/xproto_8h_source.html#l01151
		// { data8: this.uint8_t.array(20) }
		// { data32: this.uint16_t.array(10) }
		{ data32: this.uint32_t.array(5) }
	]);
	this.xcb_connection_t = ctypes.StructType('xcb_connection_t');
	this.xcb_generic_error_t = ctypes.StructType('xcb_generic_error_t', [
		{ response_type: this.uint8_t },
		{ error_code: this.uint8_t },
		{ sequence: this.uint16_t },
		{ resource_id: this.uint32_t },
		{ minor_code: this.uint16_t },
		{ major_code: this.uint8_t },
		{ pad0: this.uint8_t },
		{ pad: this.uint32_t.array(5) },
		{ full_sequence: this.uint32_t }
	]);
	this.xcb_generic_event_t = ctypes.StructType('xcb_generic_event_t', [
		{ response_type: this.uint8_t },
		{ pad0: this.uint8_t },
		{ sequence: this.uint16_t },
		{ pad: this.uint32_t.array(7) },
		{ full_sequence: this.uint32_t }
	]);
	this.xcb_get_geometry_reply_t = ctypes.StructType('xcb_get_geometry_reply_t', [
		{ response_type: this.uint8_t },
		{ depth: this.uint8_t },
		{ sequence: this.uint16_t },
		{ length: this.uint32_t },
		{ root: this.xcb_window_t },
		{ x: this.int16_t },
		{ y: this.int16_t },
		{ width: this.uint16_t },
		{ height: this.uint16_t },
		{ border_width: this.uint16_t },
		{ pad0: this.uint8_t.array(2) }
	]);
	this.xcb_get_image_reply_t = ctypes.StructType('xcb_get_image_reply_t', [
		{ response_type: this.uint8_t },
		{ depth: this.uint8_t },
		{ sequence: this.uint16_t },
		{ length: this.uint32_t },
		{ visual: this.xcb_visualid_t },
		{ pad0: this.uint8_t.array(20) }
	]);
	this.xcb_get_property_reply_t = ctypes.StructType('xcb_get_property_reply_t', [
		{ response_type: this.uint8_t },
		{ format: this.uint8_t },
		{ sequence: this.uint16_t },
		{ length: this.uint32_t },
		{ type: this.xcb_atom_t },
		{ bytes_after: this.uint32_t },
		{ value_len: this.uint32_t },
		{ pad0: this.uint8_t.array(12) }
	]);
	this.xcb_get_window_attributes_reply_t = ctypes.StructType('xcb_get_window_attributes_reply_t', [ // http://www.linuxhowtos.org/manpages/3/xcb_get_window_attributes_unchecked.htm
		{ response_type: this.uint8_t },
		{ backing_store: this.uint8_t },
		{ sequence: this.uint16_t },
		{ length: this.uint32_t },
		{ visual: this.xcb_visualid_t },
		{ _class: this.uint16_t },
		{ bit_gravity: this.uint8_t },
		{ win_gravity: this.uint8_t },
		{ backing_planes: this.uint32_t },
		{ backing_pixel: this.uint32_t },
		{ save_under: this.uint8_t },
		{ map_is_installed: this.uint8_t },
		{ map_state: this.uint8_t },
		{ override_redirect: this.uint8_t },
		{ colormap: this.xcb_colormap_t },
		{ all_event_masks: this.uint32_t },
		{ your_event_mask: this.uint32_t },
		{ do_not_propagate_mask: this.uint16_t },
		{ pad0: this.uint8_t.array(2) }
	]);
	this.xcb_grab_keyboard_reply_t = ctypes.StructType('xcb_grab_keyboard_reply_t', [
		{ response_type: this.uint8_t },
		{ status: this.uint8_t },
		{ sequence: this.uint16_t },
		{ length: this.uint32_t }
	]);
	this.xcb_intern_atom_reply_t = ctypes.StructType('xcb_intern_atom_reply_t', [
		{ response_type: this.uint8_t },
		{ pad0: this.uint8_t },
		{ sequence: this.uint16_t },
		{ length: this.uint32_t },
		{ atom: this.xcb_atom_t }
	]);
	this.xcb_key_press_event_t = ctypes.StructType('xcb_key_press_event_t', [ // https://github.com/netzbasis/openbsd-xenocara/blob/e6500f41b55e38013ac9b489f66fe49df6b8b68c/lib/libxcb/src/xproto.h#L523
		{ response_type: this.uint8_t },
		{ detail: this.xcb_keycode_t },
		{ sequence: this.uint16_t },
		{ time: this.xcb_timestamp_t },
		{ root: this.xcb_window_t },
		{ event: this.xcb_window_t },
		{ child: this.xcb_window_t },
		{ root_x: this.int16_t },
		{ root_y: this.int16_t },
		{ event_x: this.int16_t },
		{ event_y: this.int16_t },
		{ state: this.uint16_t },
		{ same_screen: this.uint8_t },
		{ pad0: this.uint8_t }
	]);
	this.xcb_key_symbols_t = ctypes.StructType('_XCBKeySymbols');
	this.xcb_query_tree_reply_t = ctypes.StructType('xcb_query_tree_reply_t', [
		{ response_type: this.uint8_t },
		{ pad0: this.uint8_t },
		{ sequence: this.uint16_t },
		{ length: this.uint32_t },
		{ root: this.xcb_window_t },
		{ parent: this.xcb_window_t },
		{ children_len: this.uint16_t },
		{ pad1: this.uint8_t.array(14) }
	]);
	this.xcb_randr_get_crtc_info_reply_t = ctypes.StructType('xcb_randr_get_crtc_info_reply_t', [ // http://www.linuxhowtos.org/manpages/3/xcb_randr_get_crtc_info_reply.htm
		{ response_type: this.uint8_t },
		{ status: this.uint8_t },
		{ sequence: this.uint16_t },
		{ length: this.uint32_t },
		{ timestamp: this.xcb_timestamp_t },
		{ x: this.int16_t },
		{ y: this.int16_t },
		{ width: this.uint16_t },
		{ height: this.uint16_t },
		{ mode: this.xcb_randr_mode_t },
		{ rotation: this.uint16_t },
		{ rotations: this.uint16_t },
		{ num_outputs: this.uint16_t },
		{ num_possible_outputs: this.uint16_t }
	]);
	this.xcb_randr_get_screen_resources_current_reply_t = ctypes.StructType('xcb_randr_get_screen_resources_current_reply_t', [ // http://www.linuxhowtos.org/manpages/3/xcb_randr_get_screen_resources_current_outputs_length.htm
		{ response_type: this.uint8_t },
		{ pad0: this.uint8_t },
		{ sequence: this.uint16_t },
		{ length: this.uint32_t },
		{ timestamp: this.xcb_timestamp_t },
		{ config_timestamp: this.xcb_timestamp_t },
		{ num_crtcs: this.uint16_t },
		{ num_outputs: this.uint16_t },
		{ num_modes: this.uint16_t },
		{ names_len: this.uint16_t },
		{ pad1: this.uint8_t.array(8) }
	]);
	this.xcb_randr_get_output_info_reply_t = ctypes.StructType('xcb_randr_get_screen_resources_current_reply_t', [ // http://www.linuxhowtos.org/manpages/3/xcb_randr_get_output_info_reply.htm
		{ response_type: this.uint8_t },
		{ status: this.uint8_t },
		{ sequence: this.uint16_t },
		{ length: this.uint32_t },
		{ timestamp: this.xcb_timestamp_t },
		{ crtc: this.xcb_randr_crtc_t },
		{ mm_width: this.uint32_t },
		{ mm_height: this.uint32_t },
		{ connection: this.uint8_t },
		{ subpixel_order: this.uint8_t },
		{ num_crtcs: this.uint16_t },
		{ num_modes: this.uint16_t },
		{ num_preferred: this.uint16_t },
		{ num_clones: this.uint16_t },
		{ name_len: this.uint16_t }
	]);

	this.xcb_screen_t = ctypes.StructType('xcb_screen_t', [
		{ root: this.xcb_window_t },
		{ default_colormap: this.xcb_colormap_t },
		{ white_pixel: this.uint32_t },
		{ black_pixel: this.uint32_t },
		{ current_input_masks: this.uint32_t },
		{ width_in_pixels: this.uint16_t },
		{ height_in_pixels: this.uint16_t },
		{ width_in_millimeters: this.uint16_t },
		{ height_in_millimeters: this.uint16_t },
		{ min_installed_maps: this.uint16_t },
		{ max_installed_maps: this.uint16_t },
		{ root_visual: this.xcb_visualid_t },
		{ backing_stores: this.uint8_t },
		{ save_unders: this.uint8_t },
		{ root_depth: this.uint8_t },
		{ allowed_depths_len: this.uint8_t }
	]);

	this.xcb_setup_t = ctypes.StructType('xcb_setup_t', [ // https://github.com/netzbasis/openbsd-xenocara/blob/e6500f41b55e38013ac9b489f66fe49df6b8b68c/lib/libxcb/src/xproto.h#L453
		{ status: this.uint8_t },
		{ pad0: this.uint8_t },
		{ protocol_major_version: this.uint16_t },
		{ protocol_minor_version: this.uint16_t },
		{ length: this.uint16_t },
		{ release_number: this.uint32_t },
		{ resource_id_base: this.uint32_t },
		{ resource_id_mask: this.uint32_t },
		{ motion_buffer_size: this.uint32_t },
		{ vendor_len: this.uint16_t },
		{ maximum_request_length: this.uint16_t },
		{ roots_len: this.uint8_t },
		{ pixmap_formats_len: this.uint8_t },
		{ image_byte_order: this.uint8_t },
		{ bitmap_format_bit_order: this.uint8_t },
		{ bitmap_format_scanline_unit: this.uint8_t },
		{ bitmap_format_scanline_pad: this.uint8_t },
		{ min_keycode: this.xcb_keycode_t },
		{ max_keycode: this.xcb_keycode_t },
		{ pad1: this.uint8_t.array(4) }
	]);

	this.xcb_screen_iterator_t = ctypes.StructType('xcb_screen_iterator_t', [
		{ data: this.xcb_screen_t.ptr },
		{ rem: this.int },
		{ index: this.int }
	]);

	this.xcb_void_cookie_t = ctypes.StructType('xcb_void_cookie_t', [
		{ sequence: this.unsigned_int }
	]);

	// cookies
	/*
	this.xcb_get_image_cookie_t = ctypes.StructType('xcb_get_image_cookie_t', [
		{ sequence: this.unsigned_int }
	]);
	this.xcb_get_window_attributes_cookie_t = ctypes.StructType('xcb_get_window_attributes_cookie_t', [
		{ sequence: this.unsigned_int }
	]);
	this.xcb_randr_get_crtc_info_cookie_t = ctypes.StructType('xcb_randr_get_crtc_info_cookie_t',
		{ sequence: this.unsigned_int }
	);
	this.xcb_randr_get_output_info_cookie_t = ctypes.StructType('xcb_randr_get_output_info_cookie_t',
		{ sequence: this.unsigned_int }
	);
	this.xcb_randr_get_screen_resources_current_cookie_t = ctypes.StructType('xcb_randr_get_screen_resources_current_cookie_t',
		{ sequence: this.unsigned_int }
	);
	*/
	// i should do cookies like in the commented out section, however its just the same, so im just setting them equal to xcb_void_cookie_t
	this.xcb_get_geometry_cookie_t = this.xcb_void_cookie_t;
	this.xcb_get_image_cookie_t = this.xcb_void_cookie_t;
	this.xcb_get_property_cookie_t = this.xcb_void_cookie_t;
	this.xcb_get_window_attributes_cookie_t = this.xcb_void_cookie_t;
	this.xcb_grab_keyboard_cookie_t = this.xcb_void_cookie_t;
	this.xcb_intern_atom_cookie_t = this.xcb_void_cookie_t;
	this.xcb_query_tree_cookie_t = this.xcb_void_cookie_t;
	this.xcb_randr_get_crtc_info_cookie_t = this.xcb_void_cookie_t;
	this.xcb_randr_get_output_info_cookie_t = this.xcb_void_cookie_t;
	this.xcb_randr_get_screen_resources_current_cookie_t = this.xcb_void_cookie_t;

	// ADVANCED STRUCTS
	this.xcb_client_message_event_t = ctypes.StructType('xcb_client_message_event_t', [// http://www.linuxhowtos.org/manpages/3/xcb_client_message_event_t.htm // ftp://www.x.org/pub/X11R7.7/doc/man/man3/xcb_client_message_event_t.3.xhtml
		{ response_type: this.uint8_t },
		{ format: this.uint8_t },
		{ sequence: this.uint16_t },
		{ window: this.xcb_window_t },
		{ type: this.xcb_atom_t },
		{ data: this.xcb_client_message_data_t }
	]);

	// end - xcb
};

var x11Init = function() {
	var self = this;

	this.IS64BIT = is64bit;

	this.TYPE = new xlibTypes();

	// CONSTANTS
	// XAtom.h - https://github.com/simonkwong/Shamoov/blob/64aa8d3d0f69710db48691f69440ce23eeb41ad0/SeniorTeamProject/Bullet/btgui/OpenGLWindow/optionalX11/X11/Xatom.h
	// xlib.py - https://github.com/hazelnusse/sympy-old/blob/65f802573e5963731a3e7e643676131b6a2500b8/sympy/thirdparty/pyglet/pyglet/window/xlib/xlib.py#L88
	this.CONST = {
		AnyPropertyType: 0,
		BadAtom: 5,
		BadValue: 2,
		BadWindow: 3,
		False: 0,
		IsUnmapped: 0,
		IsUnviewable: 1,
		IsViewable: 2,
		None: 0,
		Success: 0,
		True: 1,
		XA_ATOM: 4,
		XA_CARDINAL: 6,
		XA_WINDOW: 33,
		RR_CONNECTED: 0,
		PropModeReplace: 0,
		PropModePrepend: 1,
		PropModeAppend: 2,
		ClientMessage: 33,
		_NET_WM_STATE_REMOVE: 0,
		_NET_WM_STATE_ADD: 1,
		_NET_WM_STATE_TOGGLE: 2,
		SubstructureRedirectMask: 1048576,
		SubstructureNotifyMask: 524288,
		ButtonPressMask: 4,
		ButtonReleaseMask: 8,
		ButtonPress: 4,
		ButtonRelease: 5,
		CurrentTime: 0,

		GrabModeSync: 0,
		GrabModeAsync: 1,
		GrabSuccess: 0,
		AlreadyGrabbed: 1,
		GrabInvalidTime: 2,
		GrabNotViewable: 3,
		GrabFrozen: 4,

		AsyncPointer: 0,
		SyncPointer: 1,
		ReplayPointer: 2,
		AsyncKeyboard: 3,
		SyncKeyboard: 4,
		ReplayKeyboard: 5,
		AsyncBoth: 6,
		SyncBoth: 7,

		NoEventMask: 0,
		KeyPressMask: 1,
		KeyReleaseMask: 2,
		ButtonPressMask: 4,
		ButtonReleaseMask: 8,
		EnterWindowMask: 16,
		LeaveWindowMask: 32,
		PointerMotionMask: 64,

		KeyPress: 2,
		KeyRelease: 3,
		AsyncKeyboard: 3,
		SyncKeyboard: 4,

		XK_A: 0x0041, // lower case "a" // https://github.com/semonalbertyeah/noVNC_custom/blob/60daa01208a7e25712d17f67282497626de5704d/include/keysym.js#L216
		XK_Print: 0xff61,
		XK_Space: 0x0020,

		// GTK CONSTS
		GDK_FILTER_CONTINUE: 0,
		GDK_FILTER_TRANSLATE: 1,
		GDK_FILTER_REMOVE: 2,

		// XCB CONSTS
		XCB_COPY_FROM_PARENT: 0,
		XCB_ALL_PLANES: 0xffffffff, // define XCB_ALL_PLANES ~0 i know its a ctypes.uint32_t so instead of doing ctypes.cast(ctypes.int(-1), ctypes.uint32_t).value.toString(16) i just type in the value

		// enum xcb_window_class_t {
		XCB_WINDOW_CLASS_COPY_FROM_PARENT: 0,
    	XCB_WINDOW_CLASS_INPUT_OUTPUT: 1,
		XCB_WINDOW_CLASS_INPUT_ONLY: 2,

		XCB_NONE: 0,
		XCB_CURRENT_TIME: 0,
		XCB_NO_SYMBOL: 0, // C:\Users\Mercurius\Downloads\libxcb-1.11.1\src\xcb.h line 206 ```#define XCB_NO_SYMBOL 0L```

		XCB_MOD_MASK_SHIFT: 1,
		XCB_MOD_MASK_LOCK: 2,
		XCB_MOD_MASK_CONTROL: 4,
		XCB_MOD_MASK_1: 8,
		XCB_MOD_MASK_2: 16,
		XCB_MOD_MASK_3: 32,
		XCB_MOD_MASK_4: 64,
		XCB_MOD_MASK_5: 128,
		XCB_MOD_MASK_ANY: 32768,

		XCB_GRAB_MODE_SYNC: 0,
		XCB_GRAB_MODE_ASYNC: 1,

		XCB_GRAB_STATUS_SUCCESS: 0,
		XCB_GRAB_STATUS_ALREADY_GRABBED: 1,
		XCB_GRAB_STATUS_INVALID_TIME: 2,
		XCB_GRAB_STATUS_NOT_VIEWABLE: 3,
		XCB_GRAB_STATUS_FROZEN: 4,

		XCB_ALLOW_ASYNC_POINTER: 0,
		XCB_ALLOW_SYNC_POINTER: 1,
		XCB_ALLOW_REPLAY_POINTER: 2,
		XCB_ALLOW_ASYNC_KEYBOARD: 3,
		XCB_ALLOW_SYNC_KEYBOARD: 4,
		XCB_ALLOW_REPLAY_KEYBOARD: 5,
		XCB_ALLOW_ASYNC_BOTH: 6,
		XCB_ALLOW_SYNC_BOTH: 7,

		XCB_KEY_PRESS: 2,
		XCB_KEY_RELEASE: 3,
		XCB_BUTTON_PRESS: 4,
		XCB_BUTTON_RELEASE: 5,
		XCB_MOTION_NOTIFY: 6,
		XCB_ENTER_NOTIFY: 7,
		XCB_LEAVE_NOTIFY: 8,
		XCB_FOCUS_IN: 9,
		XCB_FOCUS_OUT: 10,
		XCB_KEYMAP_NOTIFY: 11,
		XCB_EXPOSE: 12,
		XCB_GRAPHICS_EXPOSURE: 13,
		XCB_NO_EXPOSURE: 14,
		XCB_VISIBILITY_NOTIFY: 15,
		XCB_CREATE_NOTIFY: 16,
		XCB_DESTROY_NOTIFY: 17,
		XCB_UNMAP_NOTIFY: 18,
		XCB_MAP_NOTIFY: 19,
		XCB_MAP_REQUEST: 20,
		XCB_REPARENT_NOTIFY: 21,
		XCB_CONFIGURE_NOTIFY: 22,
		XCB_CONFIGURE_REQUEST: 23,
		XCB_GRAVITY_NOTIFY: 24,

		// enum xcb_input_focus_t
		XCB_INPUT_FOCUS_NONE: 0,
		XCB_INPUT_FOCUS_POINTER_ROOT: 1,
		XCB_INPUT_FOCUS_PARENT: 2,
		XCB_INPUT_FOCUS_FOLLOW_KEYBOARD: 3,

		// enum xcb_prop_mode_t {
		XCB_PROP_MODE_REPLACE: 0,
    	XCB_PROP_MODE_PREPEND: 1,
		XCB_PROP_MODE_APPEND: 2,

		// enum xcb_atom_enum_t // https://github.com/luminousone/dmedia/blob/2adad68fb72e86855176382a34d0fea671a7f68e/platforms/linux_x11/xcb/xcb.d#L438
        XCB_ATOM_STRING: 31,
        XCB_ATOM_WM_NAME: 39,
		XCB_ATOM_WM_ICON_NAME: 37,

		XCB_EVENT_MASK_NO_EVENT: 0,
		XCB_EVENT_MASK_KEY_PRESS: 1,
		XCB_EVENT_MASK_KEY_RELEASE: 2,
		XCB_EVENT_MASK_BUTTON_PRESS: 4,
		XCB_EVENT_MASK_BUTTON_RELEASE: 8,
		XCB_EVENT_MASK_ENTER_WINDOW: 16,
		XCB_EVENT_MASK_LEAVE_WINDOW: 32,
		XCB_EVENT_MASK_POINTER_MOTION: 64,
		XCB_EVENT_MASK_POINTER_MOTION_HINT: 128,
		XCB_EVENT_MASK_BUTTON_1_MOTION: 256,
		XCB_EVENT_MASK_BUTTON_2_MOTION: 512,
		XCB_EVENT_MASK_BUTTON_3_MOTION: 1024,
		XCB_EVENT_MASK_BUTTON_4_MOTION: 2048,
		XCB_EVENT_MASK_BUTTON_5_MOTION: 4096,
		XCB_EVENT_MASK_BUTTON_MOTION: 8192,
		XCB_EVENT_MASK_KEYMAP_STATE: 16384,
		XCB_EVENT_MASK_EXPOSURE: 32768,
		XCB_EVENT_MASK_VISIBILITY_CHANGE: 65536,
		XCB_EVENT_MASK_STRUCTURE_NOTIFY: 131072,
		XCB_EVENT_MASK_RESIZE_REDIRECT: 262144,
		XCB_EVENT_MASK_SUBSTRUCTURE_NOTIFY: 524288,
		XCB_EVENT_MASK_SUBSTRUCTURE_REDIRECT: 1048576,
		XCB_EVENT_MASK_FOCUS_CHANGE: 2097152,
		XCB_EVENT_MASK_PROPERTY_CHANGE: 4194304,
		XCB_EVENT_MASK_COLOR_MAP_CHANGE: 8388608,
		XCB_EVENT_MASK_OWNER_GRAB_BUTTON: 16777216,

		// typedef enum xcb_map_state_t
		XCB_MAP_STATE_UNMAPPED: 0, // is ctypes.uint8_t because this is return value of map_state field in xcb_get_window_attributes_reply_t struct // https://xcb.freedesktop.org/manual/xproto_8h_source.html#l01489
		XCB_MAP_STATE_UNVIEWABLE: 1,
		XCB_MAP_STATE_VIEWABLE: 2,

		// is ctypes.uint8_t. so xcb_gravity_t is uint8_t as return value of bit_gravity in struct of xcb_get_window_attributes_reply_t
		// typedef enum xcb_gravity_t
		XCB_GRAVITY_BIT_FORGET: 0,
		XCB_GRAVITY_WIN_UNMAP: 0,
		XCB_GRAVITY_NORTH_WEST: 1,
		XCB_GRAVITY_NORTH: 2,
		XCB_GRAVITY_NORTH_EAST: 3,
		XCB_GRAVITY_WEST: 4,
		XCB_GRAVITY_CENTER: 5,
		XCB_GRAVITY_EAST: 6,
		XCB_GRAVITY_SOUTH_WEST: 7,
		XCB_GRAVITY_SOUTH: 8,
		XCB_GRAVITY_SOUTH_EAST: 9,
		XCB_GRAVITY_STATIC: 10,

		// enum xcb_config_window_t
	    XCB_CONFIG_WINDOW_X: 1,
	    XCB_CONFIG_WINDOW_Y: 2,
	    XCB_CONFIG_WINDOW_WIDTH: 4,
	    XCB_CONFIG_WINDOW_HEIGHT: 8,
	    XCB_CONFIG_WINDOW_BORDER_WIDTH: 16,
	    XCB_CONFIG_WINDOW_SIBLING: 32,
		XCB_CONFIG_WINDOW_STACK_MODE: 64,

		// enum xcb_stack_mode_t
		XCB_STACK_MODE_ABOVE: 0,
		XCB_STACK_MODE_BELOW: 1,
		XCB_STACK_MODE_TOP_IF: 2,
		XCB_STACK_MODE_BOTTOM_IF: 3,
		XCB_STACK_MODE_OPPOSITE: 4,

		// enum xcb_cw_t
	    XCB_CW_BACK_PIXMAP: 1,
	    XCB_CW_BACK_PIXEL: 2,
	    XCB_CW_BORDER_PIXMAP: 4,
	    XCB_CW_BORDER_PIXEL: 8,
	    XCB_CW_BIT_GRAVITY: 16,
	    XCB_CW_WIN_GRAVITY: 32,
	    XCB_CW_BACKING_STORE: 64,
	    XCB_CW_BACKING_PLANES: 128,
	    XCB_CW_BACKING_PIXEL: 256,
	    XCB_CW_OVERRIDE_REDIRECT: 512,
	    XCB_CW_SAVE_UNDER: 1024,
	    XCB_CW_EVENT_MASK: 2048,
	    XCB_CW_DONT_PROPAGATE: 4096,
	    XCB_CW_COLORMAP: 8192,
		XCB_CW_CURSOR: 16384,

		// xcbrandr
		XCB_RANDR_CONNECTION_CONNECTED: 0,
		XCB_RANDR_CONNECTION_DISCONNECTED: 1,
		XCB_RANDR_CONNECTION_UNKNOWN: 2,

		// enum xcb_image_format_t
		XCB_IMAGE_FORMAT_XY_BITMAP: 0,
		XCB_IMAGE_FORMAT_XY_PIXMAP: 1,
		XCB_IMAGE_FORMAT_Z_PIXMAP: 2,

		// GTK CONST
		EXPOSURE_MASK: 1 << 1,
		POINTER_MOTION_MASK: 1 << 2,
		POINTER_MOTION_HINT_MASK: 1 << 3,
		BUTTON_MOTION_MASK: 1 << 4,
		BUTTON1_MOTION_MASK: 1 << 5,
		BUTTON2_MOTION_MASK: 1 << 6,
		BUTTON3_MOTION_MASK: 1 << 7,
		BUTTON_PRESS_MASK: 1 << 8,
		BUTTON_RELEASE_MASK: 1 << 9,
		KEY_PRESS_MASK: 1 << 10,
		KEY_RELEASE_MASK: 1 << 11,
		ENTER_NOTIFY_MASK: 1 << 12,
		LEAVE_NOTIFY_MASK: 1 << 13,
		FOCUS_CHANGE_MASK: 1 << 14,
		STRUCTURE_MASK: 1 << 15,
		PROPERTY_CHANGE_MASK: 1 << 16,
		VISIBILITY_NOTIFY_MASK: 1 << 17,
		PROXIMITY_IN_MASK: 1 << 18,
		PROXIMITY_OUT_MASK: 1 << 19,
		SUBSTRUCTURE_MASK: 1 << 20,
		SCROLL_MASK: 1 << 21,
		ALL_EVENTS_MASK: 0x3FFFFE
	};

	var _lib = {}; // cache for lib
	var libAttempter = function(aPath, aPrefered, aPossibles) {
		// place aPrefered at front of aPossibles
		if (aPrefered) {
			aPossibles.splice(aPossibles.indexOf(aPrefered), 1); // link123543939
			aPossibles.splice(0, 0, aPrefered);
		}

		for (var i=0; i<aPossibles.length; i++) {
			try {
				_lib[aPath] = ctypes.open(aPossibles[i]);
				break;
			} catch (ignore) {
				// on windows ignore.message == "couldn't open library rawr: error 126"
				// on ubuntu ignore.message == ""couldn't open library rawr: rawr: cannot open shared object file: No such file or directory""
			}
		}
		if (!_lib[aPath]) {
			throw new Error('Path to ' + aPath + ' on operating system of , "' + OS.Constants.Sys.Name + '" was not found. This does not mean it is not supported, it means that the author of this addon did not specify the proper name. Report this to author.');
		}
	};
	var lib = function(path) {
		//ensures path is in lib, if its in lib then its open, if its not then it adds it to lib and opens it. returns lib
		//path is path to open library
		//returns lib so can use straight away

		if (!(path in _lib)) {
			//need to open the library
			//default it opens the path, but some things are special like libc in mac is different then linux or like x11 needs to be located based on linux version
			switch (path) {
				case 'gdk2':

						var possibles = ['libgdk-x11-2.0.so.0'];

						var preferred;
						// all values of preferred MUST exist in possibles reason is link123543939
						switch (core.os.name) {
							case 'linux':
								preferred = 'libgdk-x11-2.0.so.0';
								break;
							default:
								// do nothing
						}

						libAttempter(path, preferred, possibles);

					break;
				case 'gdk3':

						var possibles = ['libgdk-3.so.0'];

						var preferred;
						// all values of preferred MUST exist in possibles reason is link123543939
						switch (core.os.name) {
							case 'linux':
								preferred = 'libgdk-3.so.0';
								break;
							default:
								// do nothing
						}

						libAttempter(path, preferred, possibles);

					break;
				case 'gio':

						var possibles = ['libgio-2.0.so.0'];

						var preferred;
						// all values of preferred MUST exist in possibles reason is link123543939
						switch (core.os.name) {
							case 'linux':
								preferred = 'libgio-2.0.so.0';
								break;
							default:
								// do nothing
						}

						libAttempter(path, preferred, possibles);

					break;
				case 'gtk2':

						var possibles = ['libgtk-x11-2.0.so.0'];

						var preferred;
						// all values of preferred MUST exist in possibles reason is link123543939
						switch (core.os.name) {
							case 'linux':
								preferred = 'libgtk-x11-2.0.so.0';
								break;
							default:
								// do nothing
						}

						libAttempter(path, preferred, possibles);

					break;
				case 'xcb':

						var possibles = ['libxcb.so', 'libxcb.so.1'];

						var preferred;
						// all values of preferred MUST exist in possibles reason is link123543939
						switch (core.os.name) {
							case 'freebsd': // physically unverified
							case 'openbsd': // physically unverified
							case 'android': // physically unverified
							case 'sunos': // physically unverified
							case 'netbsd': // physically unverified
							case 'dragonfly': // physcially unverified
							case 'gnu/kfreebsd': // physically unverified
							case 'linux':
								preferred = 'libxcb.so';
								break;
							default:
								// do nothing
						}

						libAttempter(path, preferred, possibles);

					break;
				case 'xcbkey':

						var possibles = ['libxcb-keysyms.so', 'libxcb-keysyms.so.1'];

						var preferred;
						// all values of preferred MUST exist in possibles reason is link123543939
						switch (core.os.name) {
							case 'freebsd': // physically unverified
							case 'openbsd': // physically unverified
							case 'android': // physically unverified
							case 'sunos': // physically unverified
							case 'netbsd': // physically unverified
							case 'dragonfly': // physcially unverified
							case 'gnu/kfreebsd': // physically unverified
							case 'linux':
								preferred = 'libxcb-keysyms.so';
								break;
							default:
								// do nothing
						}

						libAttempter(path, preferred, possibles);

					break;
				case 'xcbutil':

						var possibles = ['libxcb-util.so', 'libxcb-util.so.1'];

						var preferred;
						// all values of preferred MUST exist in possibles reason is link123543939
						switch (core.os.name) {
							case 'freebsd': // physically unverified
							case 'openbsd': // physically unverified
							case 'android': // physically unverified
							case 'sunos': // physically unverified
							case 'netbsd': // physically unverified
							case 'dragonfly': // physcially unverified
							case 'gnu/kfreebsd': // physically unverified
							case 'linux':
								preferred = 'libxcb-util.so';
								break;
							default:
								// do nothing
						}

						libAttempter(path, preferred, possibles);

					break;
				case 'libc':

						var possibles = ['libc.dylib', 'libc.so.7', 'libc.so.61.0', 'libc.so', 'libc.so.6', 'libc.so.0.1'];
						var preferred;
						// all values of preferred MUST exist in possibles reason is link123543939
						switch (core.os.name) {
							case 'darwin':
								preferred = 'libc.dylib';
								break;
							case 'freebsd':
								preferred = 'libc.so.7';
								break;
							case 'openbsd':
								preferred = 'libc.so.61.0';
								break;
							case 'android':
							case 'sunos':
							case 'netbsd': // physically unverified
							case 'dragonfly': // physcially unverified
								preferred = 'libc.so';
								break;
							case 'linux':
								preferred = 'libc.so.6';
								break;
							case 'gnu/kfreebsd': // physically unverified
								preferred = 'libc.so.0.1';
								break;
							default:
								// do nothing
						}

						libAttempter(path, preferred, possibles);

					break;
				case 'x11':

						var possibles = ['libX11.dylib', 'libX11.so.7', 'libX11.so.61.0', 'libX11.so', 'libX11.so.6', 'libX11.so.0.1'];
						var preferred;
						// all values of preferred MUST exist in possibles reason is link123543939
						switch (core.os.name) {
							case 'darwin': // physically unverified
								preferred = 'libX11.dylib';
								break;
							case 'freebsd': // physically unverified
								preferred = 'libX11.so.7';
								break;
							case 'openbsd': // physically unverified
								preferred = 'libX11.so.61.0';
								break;
							case 'sunos': // physically unverified
							case 'netbsd': // physically unverified
							case 'dragonfly': // physcially unverified
								preferred = 'libX11.so';
								break;
							case 'linux':
								preferred = 'libX11.so.6';
								break;
							case 'gnu/kfreebsd': // physically unverified
								preferred = 'libX11.so.0.1';
								break;
							default:
								// do nothing
						}

						libAttempter(path, preferred, possibles);

					break;
				case 'xrandr':

						var possibles = ['libXrandr.so.2'];
						var preferred;
						// all values of preferred MUST exist in possibles reason is link123543939
						switch (core.os.name) {
							case 'freebsd': // physically unverified
							case 'openbsd': // physically unverified
							case 'sunos': // physically unverified
							case 'netbsd': // physically unverified
							case 'dragonfly': // physcially unverified
							case 'linux':
							case 'gnu/kfreebsd': // physically unverified
								preferred = 'libXrandr.so.2';
								break;
							default:
								// do nothing
						}

						libAttempter(path, preferred, possibles);

					break;
				case 'xcbrandr':

						var possibles = ['libxcb-randr.so.0'];
						var preferred;
						// all values of preferred MUST exist in possibles reason is link123543939
						switch (core.os.name) {
							case 'freebsd': // physically unverified
							case 'openbsd': // physically unverified
							case 'sunos': // physically unverified
							case 'netbsd': // physically unverified
							case 'dragonfly': // physcially unverified
							case 'linux':
							case 'gnu/kfreebsd': // physically unverified
								preferred = 'libxcb-randr.so.0';
								break;
							default:
								// do nothing
						}

						libAttempter(path, preferred, possibles);

					break;
				default:
					try {
						_lib[path] = ctypes.open(path);
					} catch (ex) {
						throw new Error({
							name: 'addon-error',
							message: 'Could not open ctypes library path of "' + path + '"',
							ex_msg: ex.message
						});
					}
			}
		}
		return _lib[path];
	};

	// start - function declares
	var _api = {};
	this.API = function(declaration) { // it means ensureDeclared and return declare. if its not declared it declares it. else it returns the previously declared.
		if (!(declaration in _api)) {
			_api[declaration] = preDec[declaration](); //if declaration is not in preDec then dev messed up
		}
		return _api[declaration];
	};

	// start - predefine your declares here
	var preDec = { //stands for pre-declare (so its just lazy stuff) //this must be pre-populated by dev // do it alphabateized by key so its ez to look through
		XAllPlanes: function() {
			/* http://tronche.com/gui/x/xlib/display/display-macros.html
			 * unsigned long XAllPlanes()
			 */
			return lib('x11').declare('XAllPlanes', self.TYPE.ABI,
				self.TYPE.unsigned_long	// return
			);
		},
		XAllowEvents: function() {
			/* http://www.x.org/releases/X11R7.6/doc/man/man3/XAllowEvents.3.xhtml
			 * int XAllowEvents(
			 *   Display *display,
			 *   int event_mode,
			 *   Time time
			 * );
			 */
			return lib('x11').declare('XAllowEvents', self.TYPE.ABI,
				self.TYPE.int,				// return
				self.TYPE.Display.ptr,		// *display
				self.TYPE.int,				// event_mode
				self.TYPE.Time				// time
			);
		},
		XBlackPixel: function() {
			/* http://tronche.com/gui/x/xlib/display/display-macros.html
			 * unsigned long XBlackPixel(
			 *   Display *display;
			 *   int screen_number;
			 * );
			 */
			return lib('x11').declare('XBlackPixel', self.TYPE.ABI,
				self.TYPE.unsigned_long,	// return
				self.TYPE.Display.ptr,		// *display
				self.TYPE.int				// screen_number
			);
		},
		XChangeActivePointerGrab: function() {
			/* http://www.x.org/releases/current/doc/man/man3/XGrabPointer.3.xhtml
			 * int XChangeActivePointerGrab (
			 *   Display *display,
			 *   unsigned_int event_mask,
			 *   Cursor cursor,
			 *   Time time
			 * );
			*/
			return lib('x11').declare('XChangeActivePointerGrab', self.TYPE.ABI,
				self.TYPE.int,			// return
				self.TYPE.Display.ptr,	// *display
				self.TYPE.unsigned_int,	// event_mask
				self.TYPE.Cursor,		// cursor
				self.TYPE.Time 			// time
			);
		},
		XChangeProperty: function() {
			/* http://www.xfree86.org/4.4.0/XChangeProperty.3.html
			 * int XChangeProperty(
			 *   Display *display,
			 *   Window w,
			 *   Atom property,
			 *   Atom type,
			 *   int format,
			 *   int mode,
			 *   unsigned char *data,
			 *   int nelements
			 * );
			 */
			return lib('x11').declare('XChangeProperty', self.TYPE.ABI,
				self.TYPE.int,				// return
				self.TYPE.Display.ptr,		// *display
				self.TYPE.Window,				// w
				self.TYPE.Atom,				// property
				self.TYPE.Atom,				// type
				self.TYPE.int,				// format
				self.TYPE.int,				// mode
				self.TYPE.unsigned_char.ptr,	// *data
				self.TYPE.int					// nelements
			);
		},
		XCheckMaskEvent: function() {
			/* https://tronche.com/gui/x/xlib/event-handling/manipulating-event-queue/XCheckMaskEvent.html
			 * Bool XCheckMaskEvent(
			 *   Display *display,
			 *   long event_mask,
			 *   XEvent *event_return
			 * );
			 */
			return lib('x11').declare('XCheckMaskEvent', self.TYPE.ABI,
				self.TYPE.Bool,			// return
				self.TYPE.Display.ptr,	// *display
				self.TYPE.long,			// event_mask
				self.TYPE.XEvent.ptr	// *event_return
			);
		},
		XCloseDisplay: function() {
			/* http://www.xfree86.org/4.4.0/XCloseDisplay.3.html
			 * int XCloseDisplay(
			 *   Display	*display
			 * );
			 */
			return lib('x11').declare('XCloseDisplay', self.TYPE.ABI,
				self.TYPE.int,		// return
				self.TYPE.Display.ptr	// *display
			);
		},
		XConnectionNumber: function() {
			/* http://tronche.com/gui/x/xlib/display/display-macros.html
			 * int XConnectionNumber(
			 *   Display *display;
			 * );
			 */
			return lib('x11').declare('XConnectionNumber', self.TYPE.ABI,
				self.TYPE.int,			// return
				self.TYPE.Display.ptr	// *display
			);
		},
		XCreateSimpleWindow: function() {
			/* http://tronche.com/gui/x/xlib/window/XCreateWindow.html
			 * Window XCreateSimpleWindow(
			 *   Display *display,
			 *   Window parent,
			 *   int x,
			 *   int y,
			 *   unsigned_int width, height,
			 *   unsigned_int border_width,
			 *   unsigned_long border,
			 *   unsigned_long background
			 * );
			 */
			return lib('x11').declare('XCreateSimpleWindow', self.TYPE.ABI,
				self.TYPE.Window,			// return
				self.TYPE.Display.ptr,		// *display
				self.TYPE.Window,			// parent
				self.TYPE.int,				// x
				self.TYPE.int,				// y
				self.TYPE.unsigned_int,		// width
				self.TYPE.unsigned_int,		// height
				self.TYPE.unsigned_int,		// border_width
				self.TYPE.unsigned_long,	// border
				self.TYPE.unsigned_long		// background
			);
		},
		XDefaultRootWindow: function() {
			/* http://www.xfree86.org/4.4.0/DefaultRootWindow.3.html
			 * Window DefaultRootWindow(
			 *   Display	*display
			 * );
			 */
			return lib('x11').declare('XDefaultRootWindow', self.TYPE.ABI,
				self.TYPE.Window,		// return
				self.TYPE.Display.ptr	// *display
			);
		},
		XDefaultScreen: function() {
			/* int XDefaultScreen(
			 *   Display *display;
			 * )
			 */
			return lib('x11').declare('XDefaultScreen', self.TYPE.ABI,
				self.TYPE.int,			// return
				self.TYPE.Display.ptr	// *display
			);
		},
		XDefaultScreenOfDisplay: function() {
			/* http://www.xfree86.org/4.4.0/DefaultScreenOfDisplay.3.html
			 * Screen *XDefaultScreenOfDisplay(
			 *   Display *display;
			 * )
			 */
			return lib('x11').declare('XDefaultScreenOfDisplay', self.TYPE.ABI,
				self.TYPE.Screen.ptr,		// return
				self.TYPE.Display.ptr		// *display
			);
		},
		XFlush: function() {
			/* http://www.xfree86.org/4.4.0/XFlush.3.html
			 * int XFlush(
			 *   Display	*display
			 * );
			 */
			return lib('x11').declare('XFlush', self.TYPE.ABI,
				self.TYPE.int,		// return
				self.TYPE.Display.ptr	// *display
			);
		},
		XFree: function() {
			/* http://www.xfree86.org/4.4.0/XFree.3.html
			 * int XFree(
			 *   void	*data
			 * );
			 */
			return lib('x11').declare('XFree', self.TYPE.ABI,
				self.TYPE.int,		// return
				self.TYPE.void.ptr	// *data
			);
		},
		XFreeStringList: function() {
			/* http://www.xfree86.org/4.4.0/XFreeStringList.3.html
			 * void XFreeStringList (
			 *   char **list
			 * );
			 */
			return lib('x11').declare('XFreeStringList', self.TYPE.ABI,
				self.TYPE.void,			// return
				self.TYPE.char.ptr.ptr	// **list
			);
		},
		XGetAtomNames: function() {
			/* NOTE: XGetAtomNames() is more efficient, but doesn't exist in X11R5. Source: https://github.com/JohnArchieMckown/nedit/blob/b4560954930d28113086b5471ffcda27a3d28e77/source/server_common.c#L130
			 * http://www.x.org/releases/X11R7.5/doc/man/man3/XGetAtomNames.3.html
			 * Status XGetAtomNames (
			 *   Display *display,
			 *   Atom *atoms,
			 *   int count,
			 *   char **names_return
			 * );
			 */
			return lib('x11').declare('XGetAtomNames', self.TYPE.ABI,
				self.TYPE.Status,		// return
				self.TYPE.Display.ptr,	// *display
				self.TYPE.Atom.ptr,		// *atoms
				self.TYPE.int,			// count
				self.TYPE.char.ptr.ptr	// **names_return
			);
		},
		XGetGeometry: function() {
			/* http://www.xfree86.org/4.4.0/XGetGeometry.3.html
			 * Status XGetGeometry(
			 *   Display 		*display,
			 *   Drawable		d,	// It is legal to pass an InputOnly window as a drawable to this request.
			 *   Window			*root_return,
			 *   int			*x_return,
			 *   int			*y_return,
			 *   unsigned int	*width_return,
			 *   unsigned int	*height_return,
			 *   unsigned int	*border_width_return,
			 *   unsigned int	*depth_return
			 * );
			 */
			return lib('x11').declare('XGetGeometry', self.TYPE.ABI,
				self.TYPE.Status,			// return
				self.TYPE.Display.ptr,		// *display
				self.TYPE.Drawable,			// d
				self.TYPE.Window.ptr,		// *root_return
				self.TYPE.int.ptr,			// *x_return
				self.TYPE.int.ptr,			// *y_return
				self.TYPE.unsigned_int.ptr,	// *width_return
				self.TYPE.unsigned_int.ptr,	// *height_return
				self.TYPE.unsigned_int.ptr,	// *border_width_return
				self.TYPE.unsigned_int.ptr	// *depth_return
			);
		},
		XGetImage: function() {
			/* http://www.xfree86.org/4.4.0/XGetImage.3.html
			 * XImage *XGetImage (
			 *   Display *display,
			 *   Drawable d,
			 *   int x,
			 *   int y,
			 *   unsigned int width,
			 *   unsigned int height,
			 *   unsigned long plane_mask,
			 *   int format
			 * );
			 */
			return lib('x11').declare('XGetImage', self.TYPE.ABI,
				self.TYPE.XImage.ptr,		// return
				self.TYPE.Display.ptr,		// *display,
				self.TYPE.Drawable,			// d,
				self.TYPE.int,				// x,
				self.TYPE.int,				// y,
				self.TYPE.unsigned_int,		// width,
				self.TYPE.unsigned_int,		// height,
				self.TYPE.unsigned_long,	// plane_mask,
				self.TYPE.int				// format
			);
		},
		XGetInputFocus: function() {
			/* http://www.x.org/releases/X11R7.6/doc/man/man3/XGetInputFocus.3.xhtml
			 * int XGetInputFocus(
			 *   Display *display,
			 *   Window *focus_return,
			 *   int *revert_to_return
			 * );
			 */
			return lib('x11').declare('XGetInputFocus', self.TYPE.ABI,
				self.TYPE.int,			// return
				self.TYPE.Display.ptr,	// *display
				self.TYPE.Window.ptr,	// *focus_return
				self.TYPE.int.ptr		// *revert_to_return
			);
		},
		XGetWindowAttributes: function() {
			/* http://www.xfree86.org/4.4.0/XGetWindowAttributes.3.html
			 * Status XGetWindowAttributes(
			 *   Display			*display,
			 *   Window 			w,
			 *   XWindowAttributes	*window_attributes_return
			 * );
			 */
			return lib('x11').declare('XGetWindowAttributes', self.TYPE.ABI,
				self.TYPE.Status,				// return
				self.TYPE.Display.ptr,			// *display
				self.TYPE.Window,				// w
				self.TYPE.XWindowAttributes.ptr	// *window_attributes_return
			);
		},
		XGetWindowProperty: function() {
			/* http://www.xfree86.org/4.4.0/XGetWindowProperty.3.html
			 * int XGetWindowProperty(
			 *   Display		*display,
			 *   Window			w,
			 *   Atom			property,
			 *   long			long_offset,
			 *   long			long_length,
			 *   Bool			delete,
			 *   Atom			req_type,
			 *   Atom			*actual_type_return,
			 *   int			*actual_format_return,
			 *   unsigned long	*nitems_return,
			 *   unsigned long	*bytes_after_return,
			 *   unsigned char	**prop_return
			 * );
			 */
			return lib('x11').declare('XGetWindowProperty', self.TYPE.ABI,
				self.TYPE.int,					// return
				self.TYPE.Display.ptr,			// *display
				self.TYPE.Window,				// w
				self.TYPE.Atom,					// property
				self.TYPE.long,					// long_offset
				self.TYPE.long,					// long_length
				self.TYPE.Bool,					// delete
				self.TYPE.Atom,					// req_type
				self.TYPE.Atom.ptr,				// *actual_type_return
				self.TYPE.int.ptr,				// *actual_format_return
				self.TYPE.unsigned_long.ptr,	// *nitems_return
				self.TYPE.unsigned_long.ptr,	// *bytes_after_return
				self.TYPE.unsigned_char.ptr.ptr	// **prop_return
			);
		},
		XGetWMName: function() {
			/* http://www.xfree86.org/4.4.0/XGetWMName.3.html
			 * Status XGetWMName(
			 *   Display		*display,
			 *   Window			w,
			 *   XTextProperty	*text_prop_return
			 * );
			 */
			 return lib('x11').declare('XGetWMName', self.TYPE.ABI,
				self.TYPE.Status,				// return
				self.TYPE.Display.ptr,			// *display
				self.TYPE.Window,				// w
				self.TYPE.XTextProperty.ptr		// *text_prop_return
			);
		},
		XGrabKey: function() {
			/* http://www.x.org/releases/current/doc/man/man3/XGrabKey.3.xhtml
			 * https://tronche.com/gui/x/xlib/input/XGrabKey.html
			 * int XGrabKey(
			 * Display *display,
			 * int keycode,
			 * unsigned int modifiers,
			 * Window grab_window,
			 * Bool owner_events,
			 * int pointer_mode,
			 * int keyboard_mode
			 * )
			 */
			return lib('x11').declare('XGrabKey', self.TYPE.ABI,
				self.TYPE.int,			// return
				self.TYPE.Display.ptr,	// *display
				self.TYPE.int,			// keycode
				self.TYPE.unsigned_int,	// modifiers
				self.TYPE.Window,		// grab_window
				self.TYPE.Bool,			// owner_events
				self.TYPE.int,			// pointer_mode
				self.TYPE.int			// keyboard_mode
			);
		},
		XGrabPointer: function() {
			/* http://www.x.org/releases/current/doc/man/man3/XGrabPointer.3.xhtml
			 * int XGrabPointer(
			 *   Display *display,
			 *   Window grab_window,
			 *   Bool owner_events,
			 *   unsigned int event_mask,
			 *   int pointer_mode,
			 *   int keyboard_mode,
			 *   Window confine_to,
			 *   Cursor cursor,
			 *   Time time
			 * );
			*/
			return lib('x11').declare('XGrabPointer', self.TYPE.ABI,
				self.TYPE.int,			// return
				self.TYPE.Display.ptr,	// *display
				self.TYPE.Window, 		// grab_window
				self.TYPE.Bool, 		// owner_events
				self.TYPE.unsigned_int,	// event_mask
				self.TYPE.int, 			// pointer_mode
				self.TYPE.int, 			// keyboard_mode
				self.TYPE.Window, 		// confine_to
				self.TYPE.Cursor, 		// cursor
				self.TYPE.Time 			// time
			);
		},
		XHeightOfScreen: function() {
			/* http://www.xfree86.org/4.4.0/HeightOfScreen.3.html
			 * int HeightOfScreen(
			 *   Screen	*screen
			 * );
			 */
			return lib('x11').declare('XHeightOfScreen', self.TYPE.ABI,
				self.TYPE.int,		// return
				self.TYPE.Screen.ptr	// *screen
			);
		},
		XInitThreads: function() {
			/* http://www.x.org/archive/X11R6.8.1/doc/XInitThreads.3.html
			 * Status XInitThreads (
			 *   void
			 * )
			 */
			return lib('x11').declare('XInitThreads', self.TYPE.ABI,
				self.TYPE.Status
			);
		},
		XInternAtom: function() {
			/* http://www.xfree86.org/4.4.0/XInternAtom.3.html
			 * Atom XInternAtom(
			 *   Display	*display,
			 *   char		*atom_name,
			 *   Bool		only_if_exists
			 * );
			 */
			 return lib('x11').declare('XInternAtom', self.TYPE.ABI,
				self.TYPE.Atom,			// return
				self.TYPE.Display.ptr,	// *display
				self.TYPE.char.ptr,		// *atom_name
				self.TYPE.Bool			// only_if_exists
			);
		},
		XKeysymToKeycode: function() {
			/* http://domesjö.se/xlib/utilities/keyboard/XKeysymToKeycode.html
			 * KeyCode XKeysymToKeycode(
			 *   Display *display,
			 *   KeySym keysym
			 * )
			 */
			return lib('x11').declare('XKeysymToKeycode', self.TYPE.ABI,
				self.TYPE.KeyCode,		// return
				self.TYPE.Display.ptr,	// *display
				self.TYPE.KeySym		// keysym
			);
		},
		XListProperties: function() {
			/* http://tronche.com/gui/x/xlib/window-information/XListProperties.html
			 * Atom *XListProperties(
			 *   Display *display,
			 *   Window w,
			 *   int *num_prop_return
			 * )
			 */
			return lib('x11').declare('XListProperties', self.TYPE.ABI,
				self.TYPE.Atom.ptr,			// return
				self.TYPE.Display.ptr,		// *display
				self.TYPE.Window,			// w
				self.TYPE.int.ptr			// *num_prop_return
			);
		},
		XMapWindow: function() {
			/* http://www.x.org/releases/current/doc/man/man3/XMapWindow.3.xhtml
			 * int XMapWindow (
			 *   Display *display,
			 *   Window w
			 * );
			 */
			return lib('x11').declare('XMapWindow', self.TYPE.ABI,
				self.TYPE.int,			// return
				self.TYPE.Display.ptr,	// *display
				self.TYPE.Window		// w
			);
		},
		XMapRaised: function() {
			/* http://www.x.org/archive/X11R7.5/doc/man/man3/XMapRaised.3.html
			 * int XMapRaised (
			 *   Display *display,
			 *   Window w
			 * );
			 */
			return lib('x11').declare('XMapRaised', self.TYPE.ABI,
				self.TYPE.int,			// return
				self.TYPE.Display.ptr,	// *display
				self.TYPE.Window		// w
			);
		},
		XMaskEvent: function() {
			/* https://tronche.com/gui/x/xlib/event-handling/manipulating-event-queue/XMaskEvent.html
			 * int XMaskEvent(
			 *   Display *display,
			 *   long event_mask,
			 *   XEvent *event_return
			 * );
			 */
			return lib('x11').declare('XMaskEvent', self.TYPE.ABI,
				self.TYPE.int,			// return
				self.TYPE.Display.ptr,	// *display
				self.TYPE.long,			// event_mask
				self.TYPE.XEvent.ptr	// *event_return
			);
		},
		XNextEvent: function() {
			/* http://www.x.org/releases/current/doc/man/man3/XNextEvent.3.xhtml
			 * int XNextEvent (
			 *   Display *display,
			 *   XEvent *event_return
			 * );
			 */
			return lib('x11').declare('XNextEvent', self.TYPE.ABI,
				self.TYPE.int,			// return
				self.TYPE.Display.ptr,	// *display
				self.TYPE.XEvent.ptr	// *event_return
			);
		},
		XOpenDisplay: function() {
			/* http://www.xfree86.org/4.4.0/XOpenDisplay.3.html
			 * Display *XOpenDisplay(
			 *   char	*display_name
			 * );
			 */
			return lib('x11').declare('XOpenDisplay', self.TYPE.ABI,
				self.TYPE.Display.ptr,	// return
				self.TYPE.char.ptr		// *display_name
			);
		},
		XPending: function() {
			/* http://tronche.com/gui/x/xlib/event-handling/XPending.html
			 * int XPending (
			 *   Display *display
			 * );
			 */
			return lib('x11').declare('XPending', self.TYPE.ABI,
				self.TYPE.int,			// return
				self.TYPE.Display.ptr	// *display
			);
		},
		XPutBackEvent: function() {
			/* www.xfree86.org/4.4.0/XPutBackEvent.3.html
			 * XPutBackEvent(
			 *   Display *display,
			 *   XEvent *event
			 * );
			 */
			return lib('x11').declare('XPutBackEvent', self.TYPE.ABI,
				self.TYPE.void,			// return
				self.TYPE.Display.ptr,	// *display
				self.TYPE.XEvent.ptr	// *event
			);
		},
		XQueryTree: function() {
			/* http://tronche.com/gui/x/xlib/window-information/XQueryTree.html
			 * Status XQueryTree (
			 *   Display *display,
			 *   Window w,
			 *   Window *root_return,
			 *   Window *parent_return,
			 *   Window **children_return,
			 *   unsigned int *nchildren_return
			 * )
			 */
			return lib('x11').declare('XQueryTree', self.TYPE.ABI,
				self.TYPE.Status,			// return
				self.TYPE.Display.ptr,		// *display
				self.TYPE.Window,			// w
				self.TYPE.Window.ptr,		// *root_return
				self.TYPE.Window.ptr,		// *parent_return
				self.TYPE.Window.ptr.ptr,	// **children_return
				self.TYPE.unsigned_int.ptr	// *nchildren_return
			);
		},
		XRootWindow: function() {
			/* http://tronche.com/gui/x/xlib/display/display-macros.html
			 * Window XRootWindow (
			 *   Display *display,
			 *   int screen_number
			 * );
			 */
			return lib('x11').declare('XRootWindow', self.TYPE.ABI,
				self.TYPE.Window,			// return
				self.TYPE.Display.ptr,		// *display
				self.TYPE.int				// screen_number
			);
		},
		XSelectInput: function() {
			/* http://www.x.org/releases/X11R7.6/doc/man/man3/XSelectInput.3.xhtml
			 * int XSelectInput(
			 *   Display *display;
			 *   Window w;
			 *   long event_mask;
			 * );
			 */
			return lib('x11').declare('XSelectInput', self.TYPE.ABI,
				self.TYPE.int,			// return
				self.TYPE.Display.ptr,	// *display
				self.TYPE.Window,		// w
				self.TYPE.long			// event_mask
			);
		},
		XSendEvent: function() {
			/* http://www.xfree86.org/4.4.0/XSendEvent.3.html
			 * Status XSendEvent(
			 *   Display *display,
			 *   Window w,
			 *   Bool propagate,
			 *   long event_mask,
			 *   XEvent *event_send
			 * );
			 */
			return lib('x11').declare('XSendEvent', self.TYPE.ABI,
				self.TYPE.Status,		// return
				self.TYPE.Display.ptr,	// *display
				self.TYPE.Window,		// w
				self.TYPE.Bool,			// propagate
				self.TYPE.long,			// event_mask
				self.TYPE.XEvent.ptr	// *event_sent
			);
		},
		XSync: function() {
			/* http://linux.die.net/man/3/xsync
			 * int XSync(Display *display, Bool discard);
			 */
			return lib('x11').declare('XSync', self.TYPE.ABI,
				self.TYPE.int,				// return
				self.TYPE.Display.ptr,		// *display
				self.TYPE.Bool				// discard
			);
		},
		XTranslateCoordinates: function() {
			/* http://www.xfree86.org/4.4.0/XTranslateCoordinates.3.html
			 * Bool XTranslateCoordinates(
			 *   Display	*display,
			 *   Window		src_w,
			 *   Window		dest_w,
			 *   int		src_x,
			 *   int		src_y,
			 *   int		*dest_x_return,
			 *   int		*dest_y_return,
			 *   Window		*child_return
			 * );
			 */
			return lib('x11').declare('XTranslateCoordinates', self.TYPE.ABI,
				self.TYPE.Bool,			// return
				self.TYPE.Display.ptr,	// *display
				self.TYPE.Window,			// src_w
				self.TYPE.Window,			// dest_w
				self.TYPE.int,			// src_x
				self.TYPE.int,			// src_y
				self.TYPE.int.ptr,		// *dest_x_return
				self.TYPE.int.ptr,		// *dest_y_return
				self.TYPE.Window.ptr		// *child_return
			);
		},
		XUngrabKey: function() {
			/* http://www.x.org/releases/current/doc/man/man3/XGrabKey.3.xhtml
			 * int XUngrabKey(
			 *   Display *display,
			 *   int keycode,
			 *   unsigned int modifiers,
			 *   Window grab_window
			 * );
			 */
			return lib('x11').declare('XUngrabKey', self.TYPE.ABI,
				self.TYPE.int,			// return
				self.TYPE.Display.ptr,	// *display
				self.TYPE.int,			// keycode
				self.TYPE.unsigned_int,	// modifiers
				self.TYPE.Window		// grab_window
			);
		},
		XUngrabPointer: function() {
			/* http://www.x.org/releases/current/doc/man/man3/XUngrabPointer.3.xhtml
			 * int XUngrabPointer(
			 *   Display *display,
			 *   Time time
			 * );
			*/
			return lib('x11').declare('XUngrabPointer', self.TYPE.ABI,
				self.TYPE.int,			// return
				self.TYPE.Display.ptr,	// *display
				self.TYPE.Time 			// time
			);
		},
		XWidthOfScreen: function() {
			/* http://www.xfree86.org/4.4.0/WidthOfScreen.3.html
			 * int WidthOfScreen(
			 *   Screen	*screen
			 * );
			 */
			return lib('x11').declare('XWidthOfScreen', self.TYPE.ABI,
				self.TYPE.int,		// return
				self.TYPE.Screen.ptr	// *screen
			);
		},
		// start - XRANDR
		XRRGetScreenResources: function() {
			/* http://cgit.freedesktop.org/xorg/lib/libXrandr/tree/src/XrrScreen.c
			 * XRRScreenResources *XRRGetScreenResources(
			 *   Display *dpy,
			 *   Window window
			 * )
			 */
			return lib('xrandr').declare('XRRGetScreenResources', self.TYPE.ABI,
				self.TYPE.XRRScreenResources.ptr,		// return
				self.TYPE.Display.ptr,					// *dpy
				self.TYPE.Window						// window
			);
		},
		XRRGetOutputInfo: function() {
			/* http://cgit.freedesktop.org/xorg/lib/libXrandr/tree/src/XrrOutput.c
			 * XRROutputInfo *XRRGetOutputInfo (
			 *   Display *dpy,
			 *   XRRScreenResources *resources,
			 *   RROutput output
			 * )
			 */
			return lib('xrandr').declare('XRRGetOutputInfo', self.TYPE.ABI,
				self.TYPE.XRROutputInfo.ptr,		// return
				self.TYPE.Display.ptr,				// *dpy
				self.TYPE.XRRScreenResources.ptr,	// *resources
				self.TYPE.RROutput					// output
			);
		},
		XRRGetCrtcInfo: function() {
			/* http://cgit.freedesktop.org/xorg/lib/libXrandr/tree/src/XrrCrtc.c
			 * XRRCrtcInfo *XRRGetCrtcInfo (
			 *   Display *dpy,
			 *   XRRScreenResources *resources,
			 *   RRCrtc crtc
			 * )
			 */
			return lib('xrandr').declare('XRRGetCrtcInfo', self.TYPE.ABI,
				self.TYPE.XRRCrtcInfo.ptr,		// return
				self.TYPE.Display.ptr,					// *dpy
				self.TYPE.XRRScreenResources.ptr,		// *resources
				self.TYPE.RRCrtc						// crtc
			);
		},
		XRRFreeCrtcInfo: function() {
			/* http://cgit.freedesktop.org/xorg/lib/libXrandr/tree/src/XrrCrtc.c
			 * void XRRFreeCrtcInfo (
			 *   XRRCrtcInfo *crtcInfo
			 * )
			 */
			return lib('xrandr').declare('XRRFreeCrtcInfo', self.TYPE.ABI,
				self.TYPE.void,				// return
				self.TYPE.XRRCrtcInfo.ptr	// *crtcInfo
			);
		},
		XRRFreeOutputInfo: function() {
			/* http://cgit.freedesktop.org/xorg/lib/libXrandr/tree/src/XrrOutput.c
			 * void XRRFreeOutputInfo (
			 *   XRROutputInfo *outputInfo
			 * )
			 */
			return lib('xrandr').declare('XRRFreeOutputInfo', self.TYPE.ABI,
				self.TYPE.void,				// return
				self.TYPE.XRROutputInfo.ptr	// *outputInfo
			);
		},
		XRRFreeScreenResources: function() {
			/* http://cgit.freedesktop.org/xorg/lib/libXrandr/tree/src/XrrScreen.c
			 * void XRRFreeScreenResources (
			 *   XRRScreenResources *resources
			 * )
			 */
			return lib('xrandr').declare('XRRFreeScreenResources', self.TYPE.ABI,
				self.TYPE.void,						// return
				self.TYPE.XRRScreenResources.ptr	// *resources
			);
		},
		// end - XRANDR
		// start - gtk
		g_app_info_get_commandline: function() {
			/* https://developer.gnome.org/gio/stable/GAppInfo.html#g-app-info-get-commandline
			 * const char *g_app_info_get_commandline (
			 *   GAppInfo *appinfo
			 * );
			 */
			return lib('gio').declare('g_app_info_get_commandline', self.TYPE.ABI,
				self.TYPE.char.ptr,		// return
				self.TYPE.GAppInfo.ptr	// *appinfo
			);
		},
		g_app_info_get_default_for_uri_scheme: function() {
			/* https://developer.gnome.org/gio/stable/GAppInfo.html#g-app-info-get-default-for-uri-scheme
			 * GAppInfo * g_app_info_get_default_for_uri_scheme (
			 *   const char *uri_scheme
			 * );
			 */
			return lib('gio').declare('g_app_info_get_default_for_uri_scheme', self.TYPE.ABI,
				self.TYPE.GAppInfo.ptr,		// return
				self.TYPE.char.ptr			// *uri_scheme
			);
		},
		g_app_info_get_executable: function() {
			/* https://developer.gnome.org/gio/stable/GAppInfo.html#g-app-info-get-executable
			 * const char *g_app_info_get_executable (
			 *   GAppInfo *appinfo
			 * );
			 */
			return lib('gio').declare('g_app_info_get_executable', self.TYPE.ABI,
				self.TYPE.char.ptr,		// return
				self.TYPE.GAppInfo.ptr	// *appinfo
			);
		},
		g_app_info_launch_uris: function() {
			/* https://developer.gnome.org/gio/unstable/GAppInfo.html#g-app-info-launch-uris
			 * gboolean g_app_info_launch_uris (
			 *   GAppInfo *appinfo,
			 *   GList *uris,
			 *   GAppLaunchContext *launch_context,
			 *   GError **error
			 * );
			 */
			return lib('gio').declare('g_app_info_launch_uris', self.TYPE.ABI,
				self.TYPE.gboolean,					// return
				self.TYPE.GAppInfo.ptr,				// *appinfo
				self.TYPE.GList.ptr,				// *uris
				self.TYPE.GAppLaunchContext.ptr,	// *launch_context
				self.TYPE.GError.ptr.ptr			// **error
			);
		},
		g_desktop_app_info_get_filename: function() {
			/* https://developer.gnome.org/gio/stable/gio-Desktop-file-based-GAppInfo.html#g-desktop-app-info-get-filename
			 * const char *g_desktop_app_info_get_filename (
			 *   GDesktopAppInfo *info
			 * );
			 */
			return lib('gio').declare('g_desktop_app_info_get_filename', self.TYPE.ABI,
				self.TYPE.char.ptr,				// return
				self.TYPE.GDesktopAppInfo.ptr	// *info
			);
		},
		g_desktop_app_info_new_from_filename: function() {
			/* https://developer.gnome.org/gio/unstable/gio-Desktop-file-based-GAppInfo.html#g-desktop-app-info-new-from-filename
			 * GDesktopAppInfo * g_desktop_app_info_new_from_filename(
			 *   const char *filename
			 * );
			 */
			return lib('gio').declare('g_desktop_app_info_new_from_filename', self.TYPE.ABI,
				self.TYPE.GDesktopAppInfo.ptr,	// return
				self.TYPE.gchar.ptr				// *filename
			);
		},
		g_file_new_for_path: function() {
			/* https://developer.gnome.org/gio/stable/GFile.html#g-file-new-for-path
			 * GFile *g_file_new_for_path (
			 *   const char *path
			 * );
			 */
			return lib('gio').declare('g_file_new_for_path', self.TYPE.ABI,
				self.TYPE.GFile.ptr,	// return
				self.TYPE.char.ptr		// *char
			);
		},
		g_file_trash: function() {
			/* https://developer.gnome.org/gio/stable/GFile.html#g-file-trash
			 * gboolean g_file_trash (
			 *   GFile *file,
			 *   GCancellable *cancellable,
			 *   GError **error
			 * );
			 */
			return lib('gio').declare('g_file_trash', self.TYPE.ABI,
				self.TYPE.gboolean,				// return
				self.TYPE.GFile.ptr,			// *file
				self.TYPE.GCancellable.ptr,		// *cancellable
				self.TYPE.GError.ptr.ptr		// **error
			);
		},
		gdk_get_default_root_window: function() {
			/* https://developer.gnome.org/gdk3/stable/gdk3-Windows.html#gdk-get-default-root-window
			 * GdkWindow *gdk_get_default_root_window (void);
			 */
			return lib(parseInt(core.firefox.version) <= 45 ? 'gdk2' : 'gdk3').declare('gdk_get_default_root_window', self.TYPE.ABI,
				self.TYPE.GdkWindow.ptr	// return
			);
		},
		gdk_screen_get_active_window: function() {
			/* https://developer.gnome.org/gdk3/stable/GdkScreen.html#gdk-screen-get-active-window
			 * GdkWindow *gdk_screen_get_active_window (
			 *   GdkScreen *screen
			 * );
			 */
			return lib(parseInt(core.firefox.version) <= 45 ? 'gdk2' : 'gdk3').declare('gdk_screen_get_active_window', self.TYPE.ABI,
				self.TYPE.GdkWindow.ptr,	// return
				self.TYPE.GdkScreen.ptr		// *screen
			);
		},
		gdk_screen_get_default: function() {
			/* https://developer.gnome.org/gdk3/stable/GdkScreen.html#gdk-screen-get-default
			 * GdkScreen *gdk_screen_get_default (void);
			 */
			return lib(parseInt(core.firefox.version) <= 45 ? 'gdk2' : 'gdk3').declare('gdk_screen_get_default', self.TYPE.ABI,
				self.TYPE.GdkScreen.ptr	// return
			);
		},
		gdk_screen_get_root_window: function() {
			/* https://developer.gnome.org/gdk3/stable/GdkScreen.html#gdk-screen-get-root-window
			 * GdkWindow *gdk_screen_get_root_window (
			 *   GdkScreen *screen
			 * );
			 */
			return lib(parseInt(core.firefox.version) <= 45 ? 'gdk2' : 'gdk3').declare('gdk_screen_get_root_window', self.TYPE.ABI,
				self.TYPE.GdkWindow.ptr,	// return
				self.TYPE.GdkScreen.ptr		// *screen
			);
		},
		gdk_window_add_filter: function() {
			/* https://developer.gnome.org/gdk3/stable/gdk3-Windows.html#gdk-window-add-filter
			 * void gdk_window_add_filter (
			 *   GdkWindow *window,
			 *   GdkFilterFunc function,
			 *   gpointer data
			 * );
			 */
			return lib(parseInt(core.firefox.version) <= 45 ? 'gdk2' : 'gdk3').declare('gdk_window_add_filter', self.TYPE.ABI,
				self.TYPE.void,				// return
				self.TYPE.GdkWindow.ptr,	// *window
				self.TYPE.GdkFilterFunc,	// function
				self.TYPE.gpointer			// data
			);
		},
		gdk_window_get_user_data: function() {
			/* https://developer.gnome.org/gdk3/stable/gdk3-Windows.html#gdk-window-get-user-data
			 * void gdk_window_get_user_data (
			 *   GdkWindow *window,
			 *   gpointer *data
			 * );
			 */
			return lib(parseInt(core.firefox.version) <= 45 ? 'gdk2' : 'gdk3').declare('gdk_window_get_user_data', self.TYPE.ABI,
				self.TYPE.void,				// return
				self.TYPE.GdkWindow.ptr,	// *window
				self.TYPE.gpointer.ptr		// *data
			);
		},
		gdk_window_remove_filter: function() {
			/* https://developer.gnome.org/gdk3/stable/gdk3-Windows.html#gdk-window-remove-filter
			 * void gdk_window_add_filter (
			 *   GdkWindow *window,
			 *   GdkFilterFunc function,
			 *   gpointer data
			 * );
			 */
			return lib(parseInt(core.firefox.version) <= 45 ? 'gdk2' : 'gdk3').declare('gdk_window_remove_filter', self.TYPE.ABI,
				self.TYPE.void,				// return
				self.TYPE.GdkWindow.ptr,	// *window
				self.TYPE.GdkFilterFunc,	// function
				self.TYPE.gpointer			// data
			);
		},
		gdk_window_set_events: function() {
			/* https://developer.gnome.org/gdk3/stable/gdk3-Windows.html#gdk-window-set-events
			 * void gdk_window_set_events (
			 *   GdkWindow *window,
			 *   GdkEventMask event_mask
			 * );
			 */
			return lib(parseInt(core.firefox.version) <= 45 ? 'gdk2' : 'gdk3').declare('gdk_window_set_events', self.TYPE.ABI,
				self.TYPE.void,				// return
				self.TYPE.GdkWindow.ptr,	// *window
				self.TYPE.GdkEventMask		// event_mask
			);
		},
		gdk_x11_drawable_get_xid: function() {
			/* https://developer.gnome.org/gdk2/stable/gdk2-X-Window-System-Interaction.html#gdk-x11-drawable-get-xid
			 * XID gdk_x11_drawable_get_xid (
			 *   GdkDrawable *drawable
			 * );
			 */
			if (parseInt(core.firefox.version) <= 45) {
				// can use gdk2 ok good
			} else {
				console.error('not available in gdk3 and this version of firefox cant use gdk2')
				throw new Error('not available in gdk3 and this version of firefox cant use gdk2')
			}
			// return lib(parseInt(core.firefox.version) <= 45 ? 'gdk2' : 'gdk3').declare('gdk_x11_drawable_get_xid', self.TYPE.ABI,
			// this is only available in gdk2
			return lib('gdk2').declare('gdk_x11_drawable_get_xid', self.TYPE.ABI,
				self.TYPE.XID,				// return
				self.TYPE.GdkDrawable.ptr	// *drawable
			);
		},
		gdk_x11_window_get_xid: function() {
			/* https://developer.gnome.org/gdk3/stable/gdk3-X-Window-System-Interaction.html#gdk-x11-window-get-xid
			 * Window gdk_x11_window_get_xid (
			 *   GdkWindow *window
			 * );
			 */
			if (parseInt(core.firefox.version) <= 45) {
				console.error('not available in gdk2 and this version of firefox cant use gdk3')
				throw new Error('not available in gdk2 and this version of firefox cant use gdk3')
			} else {
				// can use gdk3 ok good
			}
			// return lib(parseInt(core.firefox.version) <= 45 ? 'gdk2' : 'gdk3').declare('gdk_x11_drawable_get_xid', self.TYPE.ABI,
			// this is only available in gdk2
			return lib('gdk3').declare('gdk_x11_window_get_xid', self.TYPE.ABI,
				self.TYPE.Window,			// return
				self.TYPE.GdkWindow.ptr		// *window
			);
		},
		gdk_x11_window_lookup_for_display: function() {
			/* https://developer.gnome.org/gdk2/stable/gdk2-X-Window-System-Interaction.html#gdk-x11-window-lookup-for-display
			 * GdkWindow *gdk_x11_window_lookup_for_display (
			 *   GdkDisplay *display,
			 *   Window window
			 * );
			 */
			return lib(parseInt(core.firefox.version) <= 45 ? 'gdk2' : 'gdk3').declare('gdk_x11_window_lookup_for_display', self.TYPE.ABI,
				self.TYPE.GdkWindow.ptr,	// *return
				self.TYPE.GdkDisplay.ptr,	// *display
				self.TYPE.Window			// window
			);
		},
		gdk_xid_table_lookup: function() {
			/* https://developer.gnome.org/gdk2/stable/gdk2-X-Window-System-Interaction.html#gdk-xid-table-lookup
			 * gpointer gdk_xid_table_lookup (XID xid);
			 */
			// return lib(parseInt(core.firefox.version) <= 45 ? 'gdk2' : 'gdk3').declare('gdk_xid_table_lookup', self.TYPE.ABI,
			// not available in gdk3
			return lib('gdk2').declare('gdk_xid_table_lookup', self.TYPE.ABI,
				self.TYPE.gpointer,		// return
				self.TYPE.XID			// xid
			);
		},
		gtk_widget_get_window: function() {
			/* https://developer.gnome.org/gtk3/stable/GtkWidget.html#gtk-widget-get-window
			 * GdkWindow *gtk_widget_get_window (
			 *   GtkWidget *widget
			 * );
			 */
			return lib('gtk2').declare('gtk_widget_get_window', self.TYPE.ABI,
				self.TYPE.GdkWindow.ptr,	// *return
				self.TYPE.GtkWidget.ptr		// *widget
			);
		},
		gtk_window_set_keep_above: function() {
			/* https://developer.gnome.org/gtk3/stable/GtkWindow.html#gtk-window-set-keep-above
			 * void gtk_window_set_keep_above (
			 *   GtkWindow *window,
			 *   gboolean setting
			 * );
			 */
			return lib('gtk2').declare('gtk_window_set_keep_above', self.TYPE.ABI,
				self.TYPE.void,				// return
				self.TYPE.GtkWindow.ptr,	// *window
				self.TYPE.gboolean			// setting
			);
		},
		// end - gtk
		// start - libc
		memcpy: function() {
			/* http://linux.die.net/man/3/memcpy
			 * void *memcpy (
			 *   void *dest,
			 *   const void *src,
			 *   size_t n
			 * );
			 */
			return lib('libc').declare('memcpy', self.TYPE.ABI,
				self.TYPE.void,		// return
				self.TYPE.void.ptr,	// *dest
				self.TYPE.void.ptr,	// *src
				self.TYPE.size_t	// count
			);
		},
		select: function() {
			/* http://linux.die.net/man/2/select
			 * int select (
			 *   int nfds,
			 *   fd_set *readfds,
			 *   fd_set *writefds,
			 *   fd_set *exceptfds,
			 *   struct timeval *timeout
			 * );
			 */
			return lib('libc').declare('select', self.TYPE.ABI,
				self.TYPE.int,			// return
				self.TYPE.int,			// nfds
				self.TYPE.fd_set.ptr,	// *readfds  // This is supposed to be fd_set*, but on Linux at least fd_set is just an array of bitfields that we handle manually. link4765403
				self.TYPE.fd_set.ptr,	// *writefds // This is supposed to be fd_set*, but on Linux at least fd_set is just an array of bitfields that we handle manually. link4765403
				self.TYPE.fd_set.ptr,	// *exceptfds // This is supposed to be fd_set*, but on Linux at least fd_set is just an array of bitfields that we handle manually. link4765403
				self.TYPE.timeval.ptr	// *timeout
			);
		},
		// end - libc
		// start - xcb
		free: function() {
			// ???
			return lib('xcb').declare('free', self.TYPE.ABI,
				self.TYPE.void,		// return
				self.TYPE.void.ptr	// total guess, i cant find this guy declared anywhere
			);
		},
		xcb_allow_events: function() {
			/* http://www.x.org/releases/X11R7.7/doc/man/man3/xcb_allow_events.3.xhtml
			 * xcb_void_cookie_t xcb_allow_events(
			 *   xcb_connection_t *conn,
			 *   uint8_t mode,
			 *   xcb_timestamp_t time
			 * );
			 */
			return lib('xcb').declare('xcb_allow_events', self.TYPE.ABI,
				self.TYPE.xcb_void_cookie_t,		// return
				self.TYPE.xcb_connection_t.ptr,		// *conn
				self.TYPE.uint8_t,					// mode
				self.TYPE.xcb_timestamp_t			// time
			);
		},
		xcb_aux_sync: function() {
			/* http://www.x.org/archive/X11R7.5/doc/libxcb/tutorial/index.html
			 * int xcb_aux_sync (
			 *   xcb_connection_t *c
			 * );
			 */
			return lib('xcbutil').declare('xcb_aux_sync', self.TYPE.ABI,
				self.TYPE.int,					// return
				self.TYPE.xcb_connection_t.ptr	// *c
			);
		},
		xcb_change_property: function() {
			/* http://www.x.org/archive/X11R7.7/doc/man/man3/xcb_change_property.3.xhtml
			 * xcb_void_cookie_t xcb_change_property(
			 *   xcb_connection_t *conn,
			 *   uint8_t mode,
			 *   xcb_window_t window,
			 *   xcb_atom_t property,
			 *   xcb_atom_t type,
			 *   uint8_t format,
			 *   uint32_t data_len,
			 *   const void *data
			 * );
			 */
			return lib('xcb').declare('xcb_change_property', self.TYPE.ABI,
				self.TYPE.xcb_void_cookie_t,	// return
				self.TYPE.xcb_connection_t.ptr,	// *c
				self.TYPE.uint8_t,				// mode
				self.TYPE.xcb_window_t,			// window
				self.TYPE.xcb_atom_t,			// type
				self.TYPE.uint8_t,				// format
				self.TYPE.uint32_t,				// data_len
				self.TYPE.void.ptr				// *data
			);
		},
		xcb_change_property_checked: function() {
			/* https://xcb.freedesktop.org/manual/xproto_8h_source.html#l06364
			 * same as xcb_change_property
			 */
			return lib('xcb').declare('xcb_change_property_checked', self.TYPE.ABI,
				self.TYPE.xcb_void_cookie_t,	// return
				self.TYPE.xcb_connection_t.ptr,	// *c
				self.TYPE.uint8_t,				// mode
				self.TYPE.xcb_window_t,			// window
				self.TYPE.xcb_atom_t,			// type
				self.TYPE.uint8_t,				// format
				self.TYPE.uint32_t,				// data_len
				self.TYPE.void.ptr				// *data
			);
		},
		xcb_change_window_attributes: function() {
			/* https://xcb.freedesktop.org/manual/group__XCB____API.html#ga3724f4ccfdfa063439258831b75f6224
			 * xcb_void_cookie_t xcb_change_window_attributes (
			 *   xcb_connection_t 	*c,
			 *   xcb_window_t		window,
			 *   uint32_t			value_mask,
			 *   const uint32_t		*value_list
			 * )
			 */
			return lib('xcb').declare('xcb_change_window_attributes', self.TYPE.ABI,
				self.TYPE.xcb_void_cookie_t,			// return
				self.TYPE.xcb_connection_t.ptr,			// *c
				self.TYPE.xcb_window_t,					// window
				self.TYPE.uint32_t,						// value_mask
				self.TYPE.uint32_t.ptr					// *value_list
			);
		},
		xcb_configure_window: function() {
			/* https://www.x.org/releases/X11R7.7/doc/man/man3/xcb_configure_window.3.xhtml
			 * xcb_void_cookie_t xcb_configure_window(
			 *   xcb_connection_t *conn,
			 *   xcb_window_t window,
			 *   uint16_t value_mask,
			 *   const uint32_t *value_list
			 * );
			 */
			return lib('xcb').declare('xcb_configure_window', self.TYPE.ABI,
				self.TYPE.xcb_void_cookie_t,		// return
				self.TYPE.xcb_connection_t.ptr,		// *conn
				self.TYPE.xcb_window_t,				// window
				self.TYPE.uint16_t,					// value_mask
				self.TYPE.uint32_t.ptr				// *value_list
			);
		},
		xcb_connect: function() {
			// http://xcb.freedesktop.org/PublicApi/#index2h2
			return lib('xcb').declare('xcb_connect', self.TYPE.ABI,
				self.TYPE.xcb_connection_t.ptr,	// return
				self.TYPE.char.ptr,				// *display
				self.TYPE.int.ptr				// *screen
			);
		},
		xcb_connection_has_error: function() {
			/* https://xcb.freedesktop.org/manual/group__XCB__Core__API.html#ga70a6bade94bd2824db552abcf5fbdbe3
			 * int xcb_connection_has_error 	( 	xcb_connection_t *  	c	)
			 */
			return lib('xcb').declare('xcb_connection_has_error', self.TYPE.ABI,
				self.TYPE.int,					// return
				self.TYPE.xcb_connection_t.ptr	// *c
			);
		},
		xcb_create_window: function() {
			// http://damnsmallbsd.org/man/?query=xcb_create_window&sektion=3&manpath=OSF1+V5.1%2Falpha
			return lib('xcb').declare('xcb_create_window', self.TYPE.ABI,
				self.TYPE.xcb_void_cookie_t,	// return
				self.TYPE.xcb_connection_t.ptr,	// *conn
				self.TYPE.uint8_t,				// depth
				self.TYPE.xcb_window_t,			// wid
				self.TYPE.xcb_window_t,			// parent
				self.TYPE.int16_t,				// x
				self.TYPE.int16_t,				// y
				self.TYPE.uint16_t,				// width
				self.TYPE.uint16_t,				// height
				self.TYPE.uint16_t,				// border_width
				self.TYPE.uint16_t,				// _class
				self.TYPE.xcb_visualid_t,		// visual
				self.TYPE.uint32_t,				// value_mask
				self.TYPE.uint32_t.ptr			// *value_list
			);
		},
		xcb_disconnect: function() {
			// http://xcb.freedesktop.org/PublicApi/#index5h2
			return lib('xcb').declare('xcb_disconnect', self.TYPE.ABI,
				self.TYPE.void,					// return
				self.TYPE.xcb_connection_t.ptr	// *c
			);
		},
		xcb_flush: function() {
			// http://xcb.freedesktop.org/PublicApi/#index13h2
			return lib('xcb').declare('xcb_flush', self.TYPE.ABI,
				self.TYPE.int,					// return
				self.TYPE.xcb_connection_t.ptr	// *c
			);
		},
		xcb_generate_id: function() {
			// http://xcb.freedesktop.org/PublicApi/#index16h2
			return lib('xcb').declare('xcb_generate_id', self.TYPE.ABI,
				self.TYPE.uint32_t,				// return
				self.TYPE.xcb_connection_t.ptr	// *c
			);
		},
		xcb_get_geometry: function() {
			/* http://libxcb.sourcearchive.com/documentation/1.1/group__XCB____API_gca34d15705234d06d09f16513d640dfe.html#gca34d15705234d06d09f16513d640dfe
			 * http://www.linuxhowtos.org/manpages/3/xcb_get_geometry.htm
			 * xcb_get_geometry_cookie_t xcb_get_geometry(
			 *   xcb_connection_t *conn,
			 *   xcb_drawable_t drawable
			 * );
			 */
			return lib('xcb').declare('xcb_get_geometry', self.TYPE.ABI,
				self.TYPE.xcb_get_geometry_cookie_t,		// return
				self.TYPE.xcb_connection_t.ptr,				// *conn
				self.TYPE.xcb_drawable_t					// drawable
			);
		},
		xcb_get_geometry_reply: function() {
			/* http://libxcb.sourcearchive.com/documentation/1.1/group__XCB____API_g6727f2bfb24769655e52d1f1c50f58fe.html#g6727f2bfb24769655e52d1f1c50f58fe
			 * http://www.linuxhowtos.org/manpages/3/xcb_get_geometry.htm
			 * xcb_get_geometry_reply_t *xcb_get_geometry_reply(
			 *   xcb_connection_t *conn,
			 *   xcb_get_geometry_cookie_t cookie,
			 *   xcb_generic_error_t **e
			 * );
			 */
			return lib('xcb').declare('xcb_get_geometry_reply', self.TYPE.ABI,
				self.TYPE.xcb_get_geometry_reply_t.ptr,		// return
				self.TYPE.xcb_connection_t.ptr,				// *conn
				self.TYPE.xcb_get_geometry_cookie_t,		// cookie
				self.TYPE.xcb_generic_error_t.ptr.ptr		// **e
			);
		},
		xcb_get_image: function() {
			/* http://www.unix.com/man-page/centos/3/xcb_get_image/
			 * xcb_get_image_cookie_t xcb_get_image(
			 *   xcb_connection_t *conn,
			 *   uint8_t format,
			 *   xcb_drawable_t drawable,
			 *   int16_t x,
			 *   int16_t y,
			 *   uint16_t width,
			 *   uint16_t height,
			 *   uint32_t plane_mask
			 * );
			 */
			return lib('xcb').declare('xcb_get_image', self.TYPE.ABI,
				self.TYPE.xcb_get_image_cookie_t,		// return
				self.TYPE.xcb_connection_t.ptr,			// *conn
				self.TYPE.uint8_t,						// format
				self.TYPE.xcb_drawable_t,				// drawable
				self.TYPE.int16_t,						// x
				self.TYPE.int16_t,						// y
				self.TYPE.uint16_t,						// width
				self.TYPE.uint16_t,						// height
				self.TYPE.uint32_t						// plane_mask
			);
		},
		xcb_get_image_data: function() {
			/* http://www.unix.com/man-page/centos/3/xcb_get_image_data/// documentation error - http://stackoverflow.com/a/37097747/1828637
			 * https://xcb.freedesktop.org/manual/xproto_8h_source.html#l09587
			 * uint8_t *xcb_get_image_data(
			 *   const xcb_get_image_reply_t *reply
			 * );
			 */
			return lib('xcb').declare('xcb_get_image_data', self.TYPE.ABI,
				self.TYPE.uint8_t.ptr,						// return
				// self.TYPE.xcb_get_image_request_t.ptr	// *reply // documentation error - http://stackoverflow.com/a/37097747/1828637
				self.TYPE.xcb_get_image_reply_t.ptr			// *reply
			);
		},
		xcb_get_image_reply: function() {
			/* http://www.unix.com/man-page/centos/3/xcb_get_image_reply/
			 * xcb_get_image_reply_t *xcb_get_image_reply(
			 *   xcb_connection_t *conn,
			 *   xcb_get_image_cookie_t cookie,
			 *   xcb_generic_error_t **e
			 * );
			 */
			return lib('xcb').declare('xcb_get_image_reply', self.TYPE.ABI,
				self.TYPE.xcb_get_image_reply_t.ptr,		// return
				self.TYPE.xcb_connection_t.ptr,				// *conn
				self.TYPE.xcb_get_image_cookie_t,			// cookie
				self.TYPE.xcb_generic_error_t.ptr.ptr		// **e
			);
		},
		xcb_get_property: function() {
			/* http://libxcb.sourcearchive.com/documentation/1.1/group__XCB____API_g86312758f2d011c375ae23ac2c063b7d.html#g86312758f2d011c375ae23ac2c063b7d
			 * http://www.linuxhowtos.org/manpages/3/xcb_get_property.htm
			 * xcb_get_property_cookie_t xcb_get_property(
			 *   xcb_connection_t *conn,
			 *   uint8_t _delete,
			 *   xcb_window_t window,
			 *   xcb_atom_t property,
			 *   xcb_atom_t type,
			 *   uint32_t long_offset,
			 *   uint32_t long_length
			 * );
			 */
			return lib('xcb').declare('xcb_get_property', self.TYPE.ABI,
				self.TYPE.xcb_get_property_cookie_t,		// return
				self.TYPE.xcb_connection_t.ptr,				// *conn
				self.TYPE.uint8_t,							// _delete
				self.TYPE.xcb_window_t,						// window
				self.TYPE.xcb_atom_t,						// property
				self.TYPE.xcb_atom_t,						// type
				self.TYPE.uint32_t,							// long_offset
				self.TYPE.uint32_t							// long_length
			);
		},
		xcb_get_property_reply: function() {
			/* http://libxcb.sourcearchive.com/documentation/1.1/group__XCB____API_g86312758f2d011c375ae23ac2c063b7d.html#g86312758f2d011c375ae23ac2c063b7d
			 * http://www.linuxhowtos.org/manpages/3/xcb_get_property.htm
			 * xcb_get_property_reply_t *xcb_get_property_reply(
			 *   xcb_connection_t *conn,
			 *   xcb_get_property_cookie_t cookie,
			 *   xcb_generic_error_t **e
			 * );
			 */
			return lib('xcb').declare('xcb_get_property_reply', self.TYPE.ABI,
				self.TYPE.xcb_get_property_reply_t,		// return
				self.TYPE.xcb_connection_t.ptr,			// *conn
				self.TYPE.xcb_get_property_cookie_t,	// cookie
				self.TYPE.xcb_generic_error_t.ptr.ptr	// **e
			);
		},
		xcb_get_setup: function() {
			// http://xcb.freedesktop.org/PublicApi/#index7h2
			return lib('xcb').declare('xcb_get_setup', self.TYPE.ABI,
				self.TYPE.xcb_setup_t.ptr,		// return
				self.TYPE.xcb_connection_t.ptr	// *c
			);
		},
		xcb_get_window_attributes: function() {
			/* http://www.linuxhowtos.org/manpages/3/xcb_get_window_attributes_unchecked.htm
			 * xcb_get_window_attributes_cookie_t xcb_get_window_attributes(
			 *   xcb_connection_t *conn,
			 *   xcb_window_t window
			 * );
			 */
			return lib('xcb').declare('xcb_get_window_attributes', self.TYPE.ABI,
				self.TYPE.xcb_get_window_attributes_cookie_t,	// return
				self.TYPE.xcb_connection_t.ptr,					// *conn
				self.TYPE.xcb_window_t							// window
			);
		},
		xcb_get_window_attributes_reply: function() {
			/* http://www.linuxhowtos.org/manpages/3/xcb_get_window_attributes_unchecked.htm
			 * xcb_get_window_attributes_reply_t* xcb_get_window_attributes_reply(
			 *   xcb_connection_t *conn,
			 *   xcb_get_window_attributes_cookie_t cookie,
			 *   xcb_generic_error_t **e
			 * );
			 */
			return lib('xcb').declare('xcb_get_window_attributes_reply', self.TYPE.ABI,
				self.TYPE.xcb_get_window_attributes_reply_t.ptr,	// return
				self.TYPE.xcb_connection_t.ptr,						// *conn
				self.TYPE.xcb_get_window_attributes_cookie_t,		// cookie
				self.TYPE.xcb_generic_error_t.e.ptr.ptr				// **e
			);
		},
		xcb_grab_key: function() {
			// https://github.com/emmanueldenloye/firefox-pentadactyl/blob/52bcaf3a49f81350110210a90552690b2db332a0/unused_plugins/fix-focus.js#L240
			/* http://www.x.org/releases/X11R7.7/doc/man/man3/xcb_grab_key.3.xhtml
			 * xcb_void_cookie_t xcb_grab_key(
			 *   xcb_connection_t *conn,
			 *   uint8_t owner_events,
			 *   xcb_window_t grab_window,
			 *   uint16_t modifiers,
			 *   xcb_keycode_t key,
			 *   uint8_t pointer_mode,
			 *   uint8_t keyboard_mode
			 * );
			 */
			return lib('xcb').declare('xcb_grab_key', self.TYPE.ABI,
				self.TYPE.xcb_void_cookie_t,		// return
				self.TYPE.xcb_connection_t.ptr,		// *conn
				self.TYPE.uint8_t,					// owner_events
				self.TYPE.xcb_window_t,				// grab_window
				self.TYPE.uint16_t,					// modifiers
				self.TYPE.xcb_keycode_t,			// key
				self.TYPE.uint8_t,					// pointer_mode
				self.TYPE.uint8_t					// keyboard_mode
			);
		},
		xcb_grab_keyboard: function() {
			/* http://www.unix.com/man-page/centos/3/xcb_grab_keyboard/
			 * xcb_grab_keyboard_cookie_t xcb_grab_keyboard(
			 *   xcb_connection_t *conn,
			 *   uint8_t owner_events,
			 *   xcb_window_t grab_window,
			 *   xcb_timestamp_t time,
			 *   uint8_t pointer_mode,
			 *   uint8_t keyboard_mode
			 * );
			 */
			return lib('xcb').declare('xcb_grab_keyboard', self.TYPE.ABI,
				self.TYPE.xcb_grab_keyboard_cookie_t,	// return
				self.TYPE.xcb_connection_t.ptr,		// *conn
				self.TYPE.uint8_t,					// owner_events
				self.TYPE.xcb_window_t,				// grab_window
				self.TYPE.xcb_timestamp_t,			// time
				self.TYPE.uint8_t,					// pointer_mode
				self.TYPE.uint8_t					// keyboard_mode
			);
		},
		xcb_grab_keyboard_reply: function() {
			/* http://www.unix.com/man-page/centos/3/xcb_grab_keyboard/
			 * xcb_grab_keyboard_reply_t *xcb_grab_keyboard_reply(
			 *   xcb_connection_t *conn,
			 *   xcb_grab_keyboard_cookie_t cookie,
			 *   xcb_generic_error_t **e
			 * );
			 */
			return lib('xcb').declare('xcb_grab_keyboard_reply', self.TYPE.ABI,
				self.TYPE.xcb_grab_keyboard_reply_t.ptr,	// return
				self.TYPE.xcb_connection_t.ptr,				// *conn
				self.TYPE.xcb_grab_keyboard_cookie_t,		// cookie
				self.TYPE.xcb_generic_error_t.ptr.ptr	// **e
			);
		},
		xcb_grab_key_checked: function() {
			/* http://libxcb.sourcearchive.com/documentation/1.1/group__XCB____API_gc0b5bb243475091e33be64bd2db95f14.html#gc0b5bb243475091e33be64bd2db95f14
			 * xcb_void_cookie_t xcb_grab_key(
			 *   xcb_connection_t *conn,
			 *   uint8_t owner_events,
			 *   xcb_window_t grab_window,
			 *   uint16_t modifiers,
			 *   xcb_keycode_t key,
			 *   uint8_t pointer_mode,
			 *   uint8_t keyboard_mode
			 * );
			 */
			return lib('xcbkey').declare('xcb_grab_key_checked', self.TYPE.ABI,
				self.TYPE.xcb_void_cookie_t,		// return
				self.TYPE.xcb_connection_t.ptr,		// *conn
				self.TYPE.uint8_t,					// owner_events
				self.TYPE.xcb_window_t,				// grab_window
				self.TYPE.uint16_t,					// modifiers
				self.TYPE.xcb_keycode_t,			// key
				self.TYPE.uint8_t,					// pointer_mode
				self.TYPE.uint8_t					// keyboard_mode
			);
		},
		xcb_intern_atom: function() {
			/* http://libxcb.sourcearchive.com/documentation/1.1/group__XCB____API_g5c9806a2cfa188c38ed35bff51c60410.html#g5c9806a2cfa188c38ed35bff51c60410
			 * http://www.linuxhowtos.org/manpages/3/xcb_intern_atom.htm
			 * xcb_intern_atom_cookie_t xcb_intern_atom(
			 *   xcb_connection_t *conn,
			 *   uint8_t only_if_exists,
			 *   uint16_t name_len,
			 *   const char *name
			 * );
			 */
			return lib('xcb').declare('xcb_intern_atom', self.TYPE.ABI,
				self.TYPE.xcb_intern_atom_cookie_t,		// return
				self.TYPE.xcb_connection_t.ptr,			// *conn
				self.TYPE.uint8_t,						// only_if_exists
				self.TYPE.uint16_t,						// name_len
				self.TYPE.char.ptr						// *name
			);
		},
		xcb_intern_atom_reply: function() {
			/* http://libxcb.sourcearchive.com/documentation/1.1/group__XCB____API_g235521be24c5a1c5f267150cfe175cca.html#g235521be24c5a1c5f267150cfe175cca
			 * http://www.linuxhowtos.org/manpages/3/xcb_intern_atom.htm
			 * xcb_intern_atom_reply_t *xcb_intern_atom_reply(
			 *   xcb_connection_t *conn,
			 *   xcb_intern_atom_cookie_t cookie,
			 *   xcb_generic_error_t **e
			 * );
			 */
			return lib('xcb').declare('xcb_intern_atom_reply', self.TYPE.ABI,
				self.TYPE.xcb_intern_atom_reply_t.ptr,	// return
				self.TYPE.xcb_connection_t.ptr,			// *conn
				self.TYPE.xcb_intern_atom_cookie_t,		// cookie
				self.TYPE.xcb_generic_error_t.ptr.ptr	// **e
			);
		},
		xcb_key_symbols_alloc: function() {
			/* http://www.opensource.apple.com/source/X11libs/X11libs-60/xcb-util/xcb-util-0.3.6/keysyms/xcb_keysyms.h
			 * xcb_key_symbols_t *xcb_key_symbols_alloc        (xcb_connection_t         *c);
			 */
			return lib('xcbkey').declare('xcb_key_symbols_alloc', self.TYPE.ABI,
				self.TYPE.xcb_key_symbols_t.ptr,	// return
				self.TYPE.xcb_connection_t.ptr		// *c
			);
		},
		xcb_key_symbols_free: function() {
			/* http://www.opensource.apple.com/source/X11libs/X11libs-60/xcb-util/xcb-util-0.3.6/keysyms/xcb_keysyms.h
			 * void           xcb_key_symbols_free         (xcb_key_symbols_t         *syms);
			 */
			return lib('xcbkey').declare('xcb_key_symbols_free', self.TYPE.ABI,
				self.TYPE.void,					// return
				self.TYPE.xcb_key_symbols_t.ptr	// *syms
			);
		},
		xcb_key_symbols_get_keycode: function() {
			/* http://www.opensource.apple.com/source/X11libs/X11libs-60/xcb-util/xcb-util-0.3.6/keysyms/xcb_keysyms.h
			 * xcb_keycode_t * xcb_key_symbols_get_keycode(xcb_key_symbols_t *syms, xcb_keysym_t keysym);
			 */
			return lib('xcbkey').declare('xcb_key_symbols_get_keycode', self.TYPE.ABI,
				self.TYPE.xcb_keycode_t.ptr,		// return
				self.TYPE.xcb_key_symbols_t.ptr,	// *syms
				self.TYPE.xcb_keysym_t				// keysym
			);
		},
		xcb_map_window: function() {
			// http://damnsmallbsd.org/man?query=xcb_map_window&apropos=0&sektion=3&manpath=OSF1+V5.1%2Falpha&arch=default&format=html
			return lib('xcb').declare('xcb_map_window', self.TYPE.ABI,
				self.TYPE.xcb_void_cookie_t,	// return
				self.TYPE.xcb_connection_t.ptr,		// *conn
				self.TYPE.xcb_window_t				// window
			);
		},
		xcb_poll_for_event: function() {
			/* https://xcb.freedesktop.org/PublicApi/#index11h2
			 * xcb_generic_event_t *xcb_poll_for_event (xcb_connection_t *c);
			 */
			return lib('xcb').declare('xcb_poll_for_event', self.TYPE.ABI,
				self.TYPE.xcb_generic_event_t.ptr,		// return
				self.TYPE.xcb_connection_t.ptr			// *c
			);
		},
		xcb_query_tree: function() {
			/* http://libxcb.sourcearchive.com/documentation/1.1/group__XCB____API_g4d0136b27bbab9642aa65d2a3edbc03c.html#g4d0136b27bbab9642aa65d2a3edbc03c
			 * http://www.linuxhowtos.org/manpages/3/xcb_query_tree.htm
			 * xcb_query_tree_cookie_t xcb_query_tree(
			 *   xcb_connection_t *conn,
			 *   xcb_window_t window
			 * );
			 */
			return lib('xcb').declare('xcb_query_tree', self.TYPE.ABI,
				self.TYPE.xcb_query_tree_cookie_t,		// return
				self.TYPE.xcb_connection_t.ptr,			// *conn
				self.TYPE.xcb_window_t					// window
			);
		},
		xcb_query_tree_children: function() {
			/* http://www.linuxhowtos.org/manpages/3/xcb_query_tree.htm // documentation error - http://stackoverflow.com/a/37097747/1828637
			 * https://xcb.freedesktop.org/manual/xproto_8h_source.html#l06177
			 * xcb_window_t *xcb_query_tree_children(
			 *   const xcb_query_tree_reply_t *reply
			 * );
			 */
			return lib('xcb').declare('xcb_query_tree_children', self.TYPE.ABI,
				self.TYPE.xcb_window_t.ptr,				// return
				// self.TYPE.xcb_query_tree_request_t.ptr	// *reply // documentation error - http://stackoverflow.com/a/37097747/1828637
				self.TYPE.xcb_query_tree_reply_t.ptr	// *reply
			);
		},
		xcb_query_tree_children_length: function() {
			/* http://www.linuxhowtos.org/manpages/3/xcb_query_tree.htm
			 * int xcb_query_tree_children_length(
			 *   const xcb_query_tree_reply_t *reply
			 * );
			 */
			return lib('xcb').declare('xcb_query_tree_children_length', self.TYPE.ABI,
				self.TYPE.int,							// return
				self.TYPE.xcb_query_tree_reply_t.ptr	// *reply
			);
		},
		xcb_query_tree_reply: function() {
			/*
			 * http://www.linuxhowtos.org/manpages/3/xcb_query_tree.htm
			 * xcb_query_tree_reply_t *xcb_query_tree_reply(
			 *   xcb_connection_t *conn,
			 *   xcb_query_tree_cookie_t cookie,
			 *   xcb_generic_error_t **e
			 * );
			 */
			return lib('xcb').declare('xcb_query_tree_reply', self.TYPE.ABI,
				self.TYPE.xcb_query_tree_reply_t.ptr,		// return
				self.TYPE.xcb_connection_t.ptr,				// *conn
				self.TYPE.xcb_query_tree_cookie_t,			// cookie
				self.TYPE.xcb_generic_error_t.ptr.ptr		// **e
			);
		},
		xcb_randr_get_crtc_info: function() {
			/* http://www.linuxhowtos.org/manpages/3/xcb_randr_get_crtc_info.htm
			 * xcb_randr_get_crtc_info_cookie_t  xcb_randr_get_crtc_info(
			 *   xcb_connection_t *conn,
			 *   xcb_randr_crtc_t crtc,
			 *   xcb_timestamp_t config_timestamp
			 * );
			 */
			return lib('xcbrandr').declare('xcb_randr_get_crtc_info', self.TYPE.ABI,
				self.TYPE.xcb_randr_get_crtc_info_cookie_t,		// return
				self.TYPE.xcb_connection_t.ptr,					// *conn
				self.TYPE.xcb_randr_crtc_t,						// crtc
				self.TYPE.xcb_timestamp_t						// config_timestamp
			);
		},
		xcb_randr_get_crtc_info_reply: function() {
			/* http://www.linuxhowtos.org/manpages/3/xcb_randr_get_crtc_info.htm
			 * xcb_randr_get_crtc_info_reply_t *xcb_randr_get_crtc_info_reply(
			 *   xcb_connection_t *conn,
			 *   xcb_randr_get_crtc_info_cookie_t cookie,
			 *   xcb_generic_error_t **e
			 * );
			 */
			return lib('xcbrandr').declare('xcb_randr_get_crtc_info_reply', self.TYPE.ABI,
				self.TYPE.xcb_randr_get_crtc_info_reply_t.ptr,		// return
				self.TYPE.xcb_connection_t.ptr,						// *conn
				self.TYPE.xcb_randr_get_crtc_info_cookie_t,			// cookie
				self.TYPE.xcb_generic_error_t.ptr.ptr				// **e
			);
		},
		xcb_randr_get_output_info: function() {
			/* http://www.linuxhowtos.org/manpages/3/xcb_randr_get_output_info.htm
			 * xcb_randr_get_output_info_cookie_t xcb_randr_get_output_info(
			 *   xcb_connection_t *conn,
			 *   xcb_randr_output_t output,
			 *   xcb_timestamp_t config_timestamp
			 * );
			 */
			return lib('xcbrandr').declare('xcb_randr_get_output_info', self.TYPE.ABI,
				self.TYPE.xcb_randr_get_output_info_cookie_t,		// return
				self.TYPE.xcb_connection_t.ptr,						// *conn
				self.TYPE.xcb_randr_output_t,						// output
				self.TYPE.xcb_timestamp_t							// config_timestamp
			);
		},
		xcb_randr_get_output_info_reply: function() {
			/* http://www.linuxhowtos.org/manpages/3/xcb_randr_get_output_info.htm
			 * xcb_randr_get_output_info_reply_t *xcb_randr_get_output_info_reply(
			 *   xcb_connection_t *conn,
			 *   xcb_randr_get_output_info_cookie_t cookie,
			 *   xcb_generic_error_t **e
			 * );
			 */
			return lib('xcbrandr').declare('xcb_randr_get_output_info_reply', self.TYPE.ABI,
				self.TYPE.xcb_randr_get_output_info_reply_t.ptr,	// return
				self.TYPE.xcb_connection_t.ptr,						// *conn
				self.TYPE.xcb_randr_get_output_info_cookie_t,		// cookie
				self.TYPE.xcb_generic_error_t.ptr.ptr				// **e
			);
		},
		xcb_randr_get_screen_resources_current: function() {
			/* http://www.linuxhowtos.org/manpages/3/xcb_randr_get_screen_resources_current.htm
			 * xcb_randr_get_screen_resources_current_cookie_t xcb_randr_get_screen_resources_current(
			 *    xcb_connection_t *conn,
			 *    xcb_window_t window
			 * );
			 */
			return lib('xcbrandr').declare('xcb_randr_get_screen_resources_current', self.TYPE.ABI,
				self.TYPE.xcb_randr_get_screen_resources_current_cookie_t,	// return
				self.TYPE.xcb_connection_t.ptr,								// *conn
				self.TYPE.xcb_window_t										// window
			);
		},
		xcb_randr_get_screen_resources_current_reply: function() {
			/* http://www.linuxhowtos.org/manpages/3/xcb_randr_get_screen_resources_current.htm
			 * xcb_randr_get_screen_resources_current_reply_t *xcb_randr_get_screen_resources_current_reply(
			 *   xcb_connection_t *conn,
			 *   xcb_randr_get_screen_resources_current_cookie_t cookie,
			 *   xcb_generic_error_t **e
			 * );
			 */
			return lib('xcbrandr').declare('xcb_randr_get_screen_resources_current_reply', self.TYPE.ABI,
				self.TYPE.xcb_randr_get_screen_resources_current_reply_t.ptr,	// return
				self.TYPE.xcb_connection_t.ptr,									// *conn
				self.TYPE.xcb_randr_get_screen_resources_current_cookie_t,		// cookie
				self.TYPE.xcb_generic_error_t.ptr.ptr							// **e
			);
		},
		xcb_randr_get_screen_resources_current_outputs: function() {
			/* http://www.linuxhowtos.org/manpages/3/xcb_randr_get_screen_resources_current_outputs.htm // documentation error - http://stackoverflow.com/a/37097747/1828637
			 * https://xcb.freedesktop.org/manual/randr_8h_source.html#l02972
			 * xcb_randr_output_t *xcb_randr_get_screen_resources_current_outputs(
			 *   const xcb_randr_get_screen_resources_current_reply_t *reply
			 * );
			 */
			return lib('xcbrandr').declare('xcb_randr_get_screen_resources_current_outputs', self.TYPE.ABI,
				self.TYPE.xcb_randr_output_t.ptr,									// return
				// self.TYPE.xcb_randr_get_screen_resources_current_request_t.ptr	// *reply // documentation error - http://stackoverflow.com/a/37097747/1828637
				self.TYPE.xcb_randr_get_screen_resources_current_reply_t.ptr		// *reply
			);
		},
		xcb_randr_get_screen_resources_current_outputs_length: function() {
			/* http://www.linuxhowtos.org/manpages/3/xcb_randr_get_screen_resources_current_outputs_length.htm
			 * int xcb_randr_get_screen_resources_current_outputs_length(
			 *   const xcb_randr_get_screen_resources_current_reply_t *reply
			 * );
			 */
			return lib('xcbrandr').declare('xcb_randr_get_screen_resources_current_outputs_length', self.TYPE.ABI,
				self.TYPE.int,													// return
				self.TYPE.xcb_randr_get_screen_resources_current_reply_t.ptr	// *reply
			);
		},
		xcb_request_check: function() {
			/* https://xcb.freedesktop.org/manual/group__XCB__Core__API.html#ga3ee7f1ad9cf0a9f1716d5c22405598fc
			 * xcb_generic_error_t* xcb_request_check 	( 	xcb_connection_t *  	c, xcb_void_cookie_t  	cookie );
			 */
			return lib('xcb').declare('xcb_request_check', self.TYPE.ABI,
				self.TYPE.xcb_generic_error_t.ptr,	// return
				self.TYPE.xcb_connection_t.ptr,		// *c
				self.TYPE.xcb_void_cookie_t			// cookie
			);
		},
		xcb_screen_next: function() {
			// https://github.com/emmanueldenloye/firefox-pentadactyl/blob/52bcaf3a49f81350110210a90552690b2db332a0/unused_plugins/fix-focus.js#L244
			return lib('xcb').declare('xcb_screen_next', self.TYPE.ABI,
				self.TYPE.void,							// return
				self.TYPE.xcb_screen_iterator_t.ptr
			);
		},
		xcb_send_event: function() {
			/* http://libxcb.sourcearchive.com/documentation/1.1/group__XCB____API_g8f8291858b47fd9c88f07d96720fbd7c.html#g8f8291858b47fd9c88f07d96720fbd7c
			 * xcb_void_cookie_t xcb_send_event(
			 xcb_connection_t *conn,
			 uint8_t propagate,
			 xcb_window_t destination,
			 uint32_t event_mask,
			 const char *event
			 );
			 */
			return lib('xcb').declare('xcb_send_event', self.TYPE.ABI,
				self.TYPE.xcb_void_cookie_t,	// return
				self.TYPE.xcb_connection_t.ptr,	// *conn
				self.TYPE.uint8_t,				// propagate
				self.TYPE.xcb_window_t,			// destination
				self.TYPE.uint32_t,				// event_mask
				self.TYPE.char.ptr				// *event
			);
		},
		xcb_send_event_checked: function() {
			/* http://libxcb.sourcearchive.com/documentation/1.1/group__XCB____API_gb052d5d58e37346d947e03eeac64c071.html#gb052d5d58e37346d947e03eeac64c071
			 * xcb_void_cookie_t xcb_send_event_checked(
			 *   xcb_connection_t *conn,
			 *   uint8_t propagate,
			 *   xcb_window_t destination,
			 *   uint32_t event_mask,
			 *   const char *event
			 * );
			 */
			return lib('xcb').declare('xcb_send_event_checked', self.TYPE.ABI,
				self.TYPE.xcb_void_cookie_t,	// return
				self.TYPE.xcb_connection_t.ptr,	// *conn
				self.TYPE.uint8_t,				// propagate
				self.TYPE.xcb_window_t,			// destination
				self.TYPE.uint32_t,				// event_mask
				self.TYPE.char.ptr				// *event
			);
		},
		xcb_set_input_focus: function() {
			/* https://www.x.org/releases/current/doc/man/man3/xcb_set_input_focus.3.xhtml
			 * xcb_void_cookie_t xcb_set_input_focus(
			 *   xcb_connection_t *conn,
			 *   uint8_t revert_to,
			 *   xcb_window_t focus,
			 *   xcb_timestamp_t time
			 * );
			 */
			return lib('xcb').declare('xcb_set_input_focus', self.TYPE.ABI,
				self.TYPE.xcb_void_cookie_t,		// return
				self.TYPE.xcb_connection_t.ptr,		// *conn
				self.TYPE.uint8_t,					// revert_to
				self.TYPE.xcb_window_t,				// focus
				self.TYPE.xcb_timestamp_t			// time
			);
		},
		xcb_setup_roots_iterator: function() {
			// https://github.com/netzbasis/openbsd-xenocara/blob/e6500f41b55e38013ac9b489f66fe49df6b8b68c/lib/libxcb/src/xproto.h#L5409
			// xcb_screen_iterator_t xcb_setup_roots_iterator (xcb_setup_t *R);
			return lib('xcb').declare('xcb_setup_roots_iterator', self.TYPE.ABI,
				self.TYPE.xcb_screen_iterator_t,	// return
				self.TYPE.xcb_setup_t.ptr			// *R
			);
		},
		xcb_ungrab_key: function() {
			/* http://www.x.org/archive/current/doc/man/man3/xcb_ungrab_key.3.xhtml
			 * xcb_void_cookie_t xcb_ungrab_key(
			 *   xcb_connection_t *conn,
			 *   xcb_keycode_t key,
			 *   xcb_window_t grab_window,
			 *   uint16_t modifiers
			 * );
			 */
			return lib('xcb').declare('xcb_ungrab_key', self.TYPE.ABI,
				self.TYPE.xcb_void_cookie_t,	// return
				self.TYPE.xcb_connection_t.ptr,	// *conn
				self.TYPE.xcb_keycode_t,		// key
				self.TYPE.xcb_window_t,			// xcb_window_t
				self.TYPE.uint16_t				// modifiers
			);
		},
		xcb_unmap_window: function() {
			/* https://www.x.org/archive/current/doc/man/man3/xcb_unmap_window.3.xhtml
			 * xcb_void_cookie_t xcb_unmap_window(
			 *   xcb_connection_t *conn,
			 *   xcb_window_t window
			 * );
			 */
			return lib('xcb').declare('xcb_unmap_window', self.TYPE.ABI,
				self.TYPE.xcb_void_cookie_t,		// return
				self.TYPE.xcb_connection_t.ptr,		// *conn
				self.TYPE.xcb_window_t				// window
			);
		},
		xcb_wait_for_event: function() {
			// http://xcb.freedesktop.org/PublicApi/#index10h2
			return lib('xcb').declare('xcb_wait_for_event', self.TYPE.ABI,
				self.TYPE.xcb_generic_event_t.ptr,	// return
				self.TYPE.xcb_connection_t.ptr		// *c
			);
		}
		// end - xcb
	};
	// end - predefine your declares here
	// end - function declares

	this.MACRO = { // http://tronche.com/gui/x/xlib/display/display-macros.html
		ConnectionNumber: function(display) {
			/* The ConnectionNumber macro returns a connection number for the specified display.
			 * http://tronche.com/gui/x/xlib/display/display-macros.html
			 * int ConnectionNumber(
			 *   Display *display
			 * );
			 */
			return self.API('XConnectionNumber')(display);
		},
		BlackPixel: function() {
			/*
			 * BlackPixel(
			 *   display,
			 *   screen_number
			 * )
			 */
			return self.API('XBlackPixel');
		},
		DefaultRootWindow: function() {
			/* The DefaultRootWindow macro returns the root window for the default screen.
			 * Argument `display` specifies the connection to the X server.
			 * Returns the root window for the default screen.
			 * http://www.xfree86.org/4.4.0/DefaultRootWindow.3.html
			 * Window DefaultRootWindow(
			 *   Display	*display
			 * );
			 */
			return self.API('XDefaultRootWindow');
		},
		DefaultScreenOfDisplay: function() {
			/* http://www.xfree86.org/4.4.0/DefaultScreenOfDisplay.3.html
			 * Screen *DefaultScreenOfDisplay(
			 *   Display	*display
			 * );
			 */
			return self.API('XDefaultScreenOfDisplay');
		},
		DefaultScreen: function() {
			/* The DefaultScreen macro returns the default screen number referenced in the XOpenDisplay routine.
			 * Argument `display` specifies the connection to the X server.
			 * Return the default screen number referenced by the XOpenDisplay() function. This macro or function should be used to retrieve the screen number in applications that will use only a single screen.
			 * http://www.xfree86.org/4.4.0/DefaultScreen.3.html
			 * int DefaultScreen(
			 *   Display *display
			 * );
			 */
			return self.API('XDefaultScreen');
		},
		HeightOfScreen: function() {
			/* http://www.xfree86.org/4.4.0/HeightOfScreen.3.html
			 * int HeightOfScreen(
			 *   Screen	*screen
			 * );
			 */
			return self.API('XHeightOfScreen');
		},
		WidthOfScreen: function() {
			/* http://www.xfree86.org/4.4.0/WidthOfScreen.3.html
			 * int WidthOfScreen(
			 *   Screen	*screen
			 * );
			 */
			return self.API('XWidthOfScreen');
		}
	};

	this._cache = {};
	this._cacheAtoms = {};
	this._cacheXCBAtoms = {};

	this.HELPER = {
		gdkWinPtrToXID: function(aGDKWindowPtr) {
			var xidOfWin;
			if (parseInt(core.firefox.version) <= 45) {
				// use gdk2
				var GdkDrawPtr = ctypes.cast(aGDKWindowPtr, self.TYPE.GdkDrawable.ptr);
				xidOfWin = self.API('gdk_x11_drawable_get_xid')(GdkDrawPtr);
			} else {
				// use gdk3
				xidOfWin = self.API('gdk_x11_window_get_xid')(aGDKWindowPtr);
			}
			return xidOfWin;
		},
		gdkWinPtrToGtkWinPtr: function(aGDKWindowPtr) {
			var gptr = self.TYPE.gpointer();
			self.API('gdk_window_get_user_data')(aGDKWindowPtr, gptr.address());
			var GtkWinPtr = ctypes.cast(gptr, self.TYPE.GtkWindow.ptr);
			return GtkWinPtr;
		},
		gtkWinPtrToXID: function(aGTKWinPtr) {
			var aGDKWinPtr = self.TYPE.HELPER.gtkWinPtrToGdkWinPtr(aGTKWinPtr);
			var aXID = self.TYPE.HELPER.gdkWinPtrToXID(null, aGDKWinPtr);
			return aXID;
		},
		gtkWinPtrToGdkWinPtr: function(aGTKWinPtr) {
			var gtkWidgetPtr = ctypes.cast(aGTKWinPtr, self.TYPE.GtkWidget.ptr);
			var backTo_gdkWinPtr = self.API('gtk_widget_get_window')(gtkWidgetPtr);
			return backTo_gdkWinPtr;
		},
		xidToGdkWinPtr: function(aXID) {
			// todo: figure out how to use gdk_x11_window_lookup_for_display and switch to that, as apparently gdk_xid_table_lookup was deprecated since 2.24
			var aGpointer = self.API('gdk_xid_table_lookup')(aXID);
			var aGDKWinPtr = ctypes.cast(aGpointer, self.TYPE.GdkWindow.ptr);
			return aGDKWinPtr;
		},
		xidToGtkWinPtr: function(aXID) {
			var aGDKWinPtr = self.HELPER.xidToGdkWinPtr(aXID);
			var aGTKWinPtr = self.HELPER.gdkWinPtrToGtkWinPtr(aGDKWinPtr);
			return aGTKWinPtr;
		},
		mozNativeHandlToGdkWinPtr: function(aMozNativeHandlePtrStr) {
			var GdkWinPtr = self.TYPE.GdkWindow.ptr(ctypes.UInt64(aMozNativeHandlePtrStr));
			return GdkWinPtr;
		},
		mozNativeHandlToGtkWinPtr: function(aMozNativeHandlePtrStr) {
			GdkWinPtr = self.HELPER.mozNativeHandlToGdkWinPtr(aMozNativeHandlePtrStr);
			var GtkWinPtr = self.HELPER.gdkWinPtrToGtkWinPtr(GdkWinPtr);
			/*
			var gptr = self.TYPE.gpointer();
			self.API('gdk_window_get_user_data')(GdkWinPtr, gptr.address());
			var GtkWinPtr = ctypes.cast(gptr, self.TYPE.GtkWindow.ptr);
			*/
			return GtkWinPtr;
		},
		mozNativeHandlToXID: function(aMozNativeHandlePtrStr) {
			GdkWinPtr = self.TYPE.mozNativeHandlToGdkWinPtr(aMozNativeHandlePtrStr);
			var xid = self.HELPER.gdkWinPtrToXID(GdkWinPtr);
			return GtkWinPtr;
		},
		cachedXCBConn: function(refreshCache) {
			if (refreshCache || !self._cache.XCBConn)  {
				self._cache.XCBConn = ostypes.API('xcb_connect')(null, null);
			}
			return self._cache.XCBConn;
		},
		cachedDefaultRootWindow: function(refreshCache/*, disp*/) {
			if (refreshCache || !self._cache.DefaultRootWindow)  {
				self._cache.DefaultRootWindow = self.MACRO.DefaultRootWindow()(/*disp*/self.HELPER.cachedXOpenDisplay());
			}
			return self._cache.DefaultRootWindow;
		},
		cachedDefaultScreen: function(refreshCache/*, disp*/) {
			if (refreshCache || !self._cache.DefaultScreen)  {
				self._cache.DefaultScreen = self.MACRO.DefaultScreen()(/*disp*/self.HELPER.cachedXOpenDisplay());
			}
			return self._cache.DefaultScreen;
		},
		cachedDefaultScreenOfDisplay: function(refreshCache/*, disp*/) {
			if (refreshCache || !self._cache.DefaultScreenOfDisplay)  {
				self._cache.DefaultScreenOfDisplay = self.MACRO.DefaultScreenOfDisplay()(/*disp*/self.HELPER.cachedXOpenDisplay());
			}
			return self._cache.DefaultScreenOfDisplay;
		},
		cachedXOpenDisplay: function(refreshCache) {
			if (refreshCache || !self._cache.XOpenDisplay)  {
				self._cache.XOpenDisplay = self.API('XOpenDisplay')(null);
			}
			return self._cache.XOpenDisplay;
		},
		ifOpenedXCloseDisplay: function() {
			if (self._cache.XOpenDisplay) {
				console.log('yes it was open, terminiating it');
				self.API('XCloseDisplay')(self._cache.XOpenDisplay);
			}
		},
		ifOpenedXCBConnClose: function() {
			if (self._cache.XCBConn) {
				self.API('xcb_disconnect')(self._cache.XCBConn);
			}
		},
		cachedAtom: function(aAtomName, createAtomIfDne, refreshCache) {
			// createAtomIfDne is jsBool, true or false. if set to true/1 then the atom is creatd if it doesnt exist. if set to false/0, then an error is thrown when atom does not exist
			// default behavior is throw when atom doesnt exist

			// aAtomName is self.TYPE.char.ptr but im pretty sure you can just pass in a jsStr
			// returns self.TYPE.Atom

			if (!(aAtomName in self._cacheAtoms) || refreshCache) {
				var atom = self.API('XInternAtom')(self.HELPER.cachedXOpenDisplay(), aAtomName, createAtomIfDne ? self.CONST.False : self.CONST.True); //passing 3rd arg of false, means even if atom doesnt exist it returns a created atom, this can be used with GetProperty to see if its supported etc, this is how Chromium does it
				if (!createAtomIfDne) {
					if (atom == self.CONST.None) { // if i pass 3rd arg as False, it will will never equal self.CONST.None it gets creatd if it didnt exist on line before
						console.warn('No atom with name:', aAtomName, 'return val of atom:', atom.toString());
						throw new Error('No atom with name "' + aAtomName + '"), return val of atom:"' +  atom.toString() + '"');
					}
				}
				self._cacheAtoms[aAtomName] = atom;
			}
			return self._cacheAtoms[aAtomName];
		},
		cachedXCBAtom: function(aAtomName, createAtomIfDne, refreshCache) {
			// createAtomIfDne is jsBool, true or false. if set to true/1 then the atom is creatd if it doesnt exist. if set to false/0, then an error is thrown when atom does not exist
			// default behavior is throw when atom doesnt exist

			// aAtomName is self.TYPE.char.ptr but im pretty sure you can just pass in a jsStr
			// returns self.TYPE.Atom

			if (!(aAtomName in self._cacheXCBAtoms) || refreshCache) {
				var atom_cookie = self.API('xcb_intern_atom')(self.HELPER.cachedXCBConn(), createAtomIfDne ? 1 : 0, aAtomName.length, aAtomName);

				var atom_reply = self.API('xcb_intern_atom_reply')(self.HELPER.cachedXCBConn(), atom_cookie, null);

				if (atom_reply.isNull()) {
					throw new Error('failed to get atom reply');
				} else {

					var atom = atom_reply.atom;
					console.log('atom:', atom, 'name:', aAtomName);
					if (!createAtomIfDne) {
						if (cutils.jscEqual(atom, self.CONST.XCB_NONE)) { // if i pass 3rd arg as False, it will will never equal self.CONST.None it gets creatd if it didnt exist on line before
							console.error('No atom with name:', aAtomName, 'return val of atom:', atom, atom_reply);
							throw new Error('No atom with name "' + aAtomName + '"), return val of atom:"' +  atom.toString() + '"');
						}
					}

					self._cacheXCBAtoms[aAtomName] = atom;

					self.API('free')(atom_reply);
				}
			}
			return self._cacheXCBAtoms[aAtomName];
		},
		getWinProp_ReturnStatus: function(devUserRequestedType, funcReturnedType, funcReturnedFormat, funcBytesAfterReturned, dontThrowOnDevTypeMismatch) {
			// devUserRequestedType is req_type arg passed to XGetWindowProperty
			// this tells us what the return of XGetWindowProperty means and if it needs XFree'ing
			// returns < 0 if nitems_return is empty and no need for XFree. > 0 if needs XFree as there are items. 0 if no items but needs XFree, i have never seen this situation and so have not set up this to return 0 // actually scratch this xfree thing it seems i have to xfree it everytime: // XGetWindowProperty() always allocates one extra byte in prop_return (even if the property is zero length) and sets it to zero so that simple properties consisting of characters do not have to be copied into yet another string before use.  // wait tested it, and i was getting some weird errors so only XFree when not empty, interesting
				// -1 - console.log('The specified property does not exist for the specified window. The delete argument was ignored. The nitems_return argument will be empty.');
				// -2 - must set dontThrowOnDevTypeMismatch to true else it throws - console.log('Specified property/atom exists on window but here because returns actual type does not match the specified type (the xgwpArg.req_type) you supplied to function. The delete argument was ignored. The nitems_return argument will be empty.');
				// 1 - console.log('The specified property exists and either you assigned AnyPropertyType to the req_type argument or the specified type matched the actual property type of the returned data.');

			if (cutils.jscEqual(funcReturnedType, self.CONST.None) && cutils.jscEqual(funcReturnedFormat, 0) && cutils.jscEqual(funcBytesAfterReturned, 0)) {
				// console.log('The specified property does not exist for the specified window. The delete argument was ignored. The nitems_return argument will be empty.');
				return -1;
			} else if (!cutils.jscEqual(devUserRequestedType, self.CONST.AnyPropertyType) && !cutils.jscEqual(devUserRequestedType, funcReturnedType)) {
				// console.log('Specified property/atom exists on window but here because returns actual type does not match the specified type (the xgwpArg.req_type) you supplied to function. The delete argument was ignored. The nitems_return argument will be empty.');
				console.info('devUserRequestedType:', cutils.jscGetDeepest(devUserRequestedType));
				console.info('funcReturnedType:', cutils.jscGetDeepest(funcReturnedType));
				if (!dontThrowOnDevTypeMismatch) {
					throw new Error('devuser supplied wrong type for title, fix it stupid, or maybe not a throw? maybe intentionally wrong? to just check if it exists on the window but dont want any data returend as dont want to XFree?');
				}
				return -2;
			} else if (cutils.jscEqual(devUserRequestedType, self.CONST.AnyPropertyType) || cutils.jscEqual(devUserRequestedType, funcReturnedType)) {
				// console.log('The specified property exists and either you assigned AnyPropertyType to the req_type argument or the specified type matched the actual property type of the returned data.');
				return 1;
			}  else {
				throw new Error('should never get here')
			}
		},
		// link4765403
		fd_set_get_idx: function(fd) {
			// https://github.com/pioneers/tenshi/blob/9b3273298c34b9615e02ac8f021550b8e8291b69/angel-player/src/chrome/content/common/serport_posix.js#L497
			if (core.os.name == 'darwin' /*is_mac*/) {
				// We have an array of int32. This should hopefully work on Darwin
				// 32 and 64 bit.
				let elem32 = Math.floor(fd / 32);
				let bitpos32 = fd % 32;
				let elem8 = elem32 * 8;
				let bitpos8 = bitpos32;
				if (bitpos8 >= 8) {     // 8
					bitpos8 -= 8;
					elem8++;
				}
				if (bitpos8 >= 8) {     // 16
					bitpos8 -= 8;
					elem8++;
				}
				if (bitpos8 >= 8) {     // 24
					bitpos8 -= 8;
					elem8++;
				}

				return {'elem8': elem8, 'bitpos8': bitpos8};
			} else { // else if (core.os.name == 'linux' /*is_linux*/) { // removed the else if so this supports bsd and solaris now
				// :todo: add 32bit support
				// Unfortunately, we actually have an array of long ints, which is
				// a) platform dependent and b) not handled by typed arrays. We manually
				// figure out which byte we should be in. We assume a 64-bit platform
				// that is little endian (aka x86_64 linux).
				let elem64 = Math.floor(fd / 64);
				let bitpos64 = fd % 64;
				let elem8 = elem64 * 8;
				let bitpos8 = bitpos64;
				if (bitpos8 >= 8) {     // 8
					bitpos8 -= 8;
					elem8++;
				}
				if (bitpos8 >= 8) {     // 16
					bitpos8 -= 8;
					elem8++;
				}
				if (bitpos8 >= 8) {     // 24
					bitpos8 -= 8;
					elem8++;
				}
				if (bitpos8 >= 8) {     // 32
					bitpos8 -= 8;
					elem8++;
				}
				if (bitpos8 >= 8) {     // 40
					bitpos8 -= 8;
					elem8++;
				}
				if (bitpos8 >= 8) {     // 48
					bitpos8 -= 8;
					elem8++;
				}
				if (bitpos8 >= 8) {     // 56
					bitpos8 -= 8;
					elem8++;
				}

				return {'elem8': elem8, 'bitpos8': bitpos8};
			}
		},
		fd_set_set: function(fdset, fd) {
			// https://github.com/pioneers/tenshi/blob/9b3273298c34b9615e02ac8f021550b8e8291b69/angel-player/src/chrome/content/common/serport_posix.js#L497
			let { elem8, bitpos8 } = self.HELPER.fd_set_get_idx(fd);
			console.info('elem8:', elem8.toString());
			console.info('bitpos8:', bitpos8.toString());
			fdset[elem8] = 1 << bitpos8;
		},
		fd_set_isset: function(fdset, fd) {
			// https://github.com/pioneers/tenshi/blob/9b3273298c34b9615e02ac8f021550b8e8291b69/angel-player/src/chrome/content/common/serport_posix.js#L497
			let { elem8, bitpos8 } = self.HELPER.fd_set_get_idx(fd);
			console.info('elem8:', elem8.toString());
			console.info('bitpos8:', bitpos8.toString());
			return !!(fdset[elem8] & (1 << bitpos8));
		}
	};
};

var ostypes = new x11Init();
