﻿var original = $('#reportDisplayForm').serialize();

$('#reportDisplayForm').on('change', function () {
    if ($('#reportDisplayForm').serialize() != original) {
        $('button[type="submit"]').attr("disabled", false);
    } else {
        $('button[type="submit"]').attr("disabled", true);
    };
});

$(window).on('beforeunload', function () {
    if ($('#reportDisplayForm').serialize() != original) {
        return "Are you want to leave before saving your changes?";
    }
});

$('#reportDisplayForm').submit(function (event) {
    event.preventDefault();

    var data = { "query": $('#reportDisplayForm').serialize() };
    $.post("/Admin/SaveReportDisplayDetails", data);

    console.log("Form submitted");

    $('button[type="submit"]').attr("disabled", true);
    original = $('#reportDisplayForm').serialize();
});