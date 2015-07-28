var api_url = 'http://nasrulhazim.com/to-do-list-server/';
jQuery(document).ready(function($) {
	$( ".date-input-css" ).datepicker();
	task_list();
});

function task_list() {
	$.ajax({
		url: api_url,
		dataType: 'json',
	})
	.done(function(e) {
		var count = 1;
		$('#todolist-data').html('');
		$.each(e.data, function(index, val) {
			$('#todolist-data').append('<tr><td>'+count+'</td><td>'+val.name+'</td><td>'+val.date+'</td><td>'+val.status+'</td><td>'+generate_actions(val.id)+'</td></td>');
			count++;
		});
		$('#main-table').table('refresh');
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
}

function task_add(post_data) {
	$.post(api_url + 'task-add.php', 
		post_data, function(data, textStatus, xhr) {
		alert(data.message);
		if(data.status == true) {
			$.each($('[name^=task-add-]'), function(index, val) {
				$('#'+val.id).val(''); // reset form input
			});
			task_list();
		}
	});
}

function task_update(post_data) {
	$.post(api_url + 'task-update.php', 
		post_data, function(data, textStatus, xhr) {
		alert(data.message);
		if(data.status == true) {
			task_list();
		}
	});
}

function task_delete(task_id) {
	$.get(api_url + 'task-delete.php?task-id='+task_id, function(data) {
		alert(data.message);
		if(data.status == true) {
			task_list(); // refresh list
		}
	});
}

function generate_actions(id) {
	var actions = '<div onclick="view_task('+id+')" data-rel="popup"  data-transition="fade" class="ui-btn ui-btn-inline ui-icon-search ui-btn-icon-notext ui-corner-all ui-btn-b">View</div>';
	actions += '<div href="#" onclick="edit_task('+id+')" data-rel="popup"  data-transition="fade" class="ui-btn ui-btn-inline ui-icon-edit ui-btn-icon-notext ui-corner-all ui-btn-b">Edit</div>';
	actions += '<div href="#" onclick="edit_status('+id+')" data-theme="b"  data-rel="popup"  data-transition="fade" class="ui-btn ui-btn-inline ui-icon-alert ui-btn-icon-notext ui-corner-all ui-btn-b">Mark Status</div>';
	actions += '<div href="#" onclick="delete_task('+id+')" data-theme="b"  data-rel="popup"  data-transition="fade" class="ui-btn ui-btn-inline ui-icon-delete ui-btn-icon-notext ui-corner-all ui-btn-b">Delete</div>';
	return actions;
}

function view_task(id) {
	$.get(api_url + 'task-get.php?task-id='+id, function(data) {
		if(data.status == true) {
			var task = data.data;
			$('#task-view-name').html(task.name);
			$('#task-view-date').html(task.date);
			$('#task-view-description').html(task.description);
			$('#popup-view-task').popup('open');
		} else {
			alert(data.message);
		}
	});
}

function edit_task(id) {
	$.get(api_url + 'task-get.php?task-id='+id, function(data) {
		if(data.status == true) {
			var task = data.data;
			$('#task-edit-id').val(task.id);
			$('#task-edit-name').val(task.name);
			$('#task-edit-date').val(task.date);
			$('#task-edit-description').val(task.description);
			$('#popup-edit-task').popup('open');
		} else {
			alert(data.message);
		}
	});
}

function edit_status(id) {
	$.get(api_url + 'task-get.php?task-id='+id, function(data) {
		if(data.status == true) {
			var task = data.data;
			$('#task-status-id').val(task.id);
			$('#task-status').val(task.status);
			$('#popup-status').popup('open');
		} else {
			alert(data.message);
		}
	});
}

function delete_task(id) {
	$('#task-delete-id').val(id);
	$('#popup-delete').popup('open');
}

function delete_now() {
	task_delete($('#task-delete-id').val());
	$('#popup-delete').popup('close');
}

function add() {
	var data = {};
	$.each($('[name^=task-add-]'), function(index, val) {
		data[val.name] = val.value;
	});
	task_add(data);
	$('#popup-add-task').popup('close');
}

function save_status() {
	$.post(api_url + 'task-status.php', {
			'task-status-id':$('#task-status-id').val(),
			'task-status':$('#task-status').val()
		}, function(data, textStatus, xhr) {
		alert(data.message);

		if(data.status == true) {
			task_list();
		}
		$('#popup-status').popup('close');
	});
}

function save_edit() {
	var data = {};
	$.each($('[name^=task-edit-]'), function(index, val) {
		data[val.name] = val.value;
	});
	task_update(data);
	$('#popup-edit-task').popup('close');
}
