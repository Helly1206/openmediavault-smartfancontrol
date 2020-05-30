/**
 * Copyright (C) 2014-2019 OpenMediaVault Plugin Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// require("js/omv/WorkspaceManager.js")
// require("js/omv/workspace/form/Panel.js")
// require("js/omv/Rpc.js")
// require("js/omv/data/Store.js")
// require("js/omv/data/Model.js")

Ext.define('OMV.module.admin.service.smartfancontrol.settings', {
    extend: 'OMV.workspace.form.Panel',
    requires: [
            'OMV.Rpc'
    ],
    rpcService: 'SmartFanControl',
    rpcGetMethod: 'getSettings',
    rpcSetMethod: 'setSettings',
    
    plugins: [{
        ptype: 'linkedfields',
        correlations: [{
            conditions: [{
                name: 'manual',
                value: false
            }],
            name: ["enable","fan_mode","fan_ONOFFgpio","fan_ONOFFinvert", "fan_PWMcalibrated", "fan_PWMgpio", "fan_PWMfrequency", 
                   "fan_PWMinvert", "fan_recalibrate", "fan_RPMgpio", "fan_RPMpullup", "fan_RPMppr", "fan_RPMedge", "fan_RPMfiltersize", 
                   "fan_Frequency", "fan_Pgain", "fan_Igain", "temp_cpu", "temp_hdd", "temp_ext", "temp_mode", "temp_Farenheit", "temp_AlarmHigh", 
                   "temp_AlarmCrit", "temp_AlarmShutdown", "control_mode", "control_TempOn", "control_TempHyst", "control_FanStart", "control_TempStart", 
                   "control_TempFull", "control_LinSteps", "control_Frequency", "control_Pgain", "control_Igain"],
            properties: ['!readOnly']
        },{
            conditions: [{
                name: 'temp_Farenheit',
                value: false
            }],
            name: ["mon_tempF"],
            properties: ['!show']
        },{
            conditions: [{
                name: 'temp_Farenheit',
                value: true
            }],
            name: ["mon_tempC"],
            properties: ['!show']
        }]
    }],

    hidePagingToolbar: false,
    reloadOnActivate: true,
    
    getFormItems: function() {
        return [{
            xtype: 'fieldset',
            title: _('General settings'),
            defaults: {
                labelSeparator: ''
            },
            items: [{
                xtype: 'checkbox',
                name: 'enable',
                fieldLabel: _('Enable'),
                readOnly: true,
                checked: false
            },{
				xtype: "numberfield",
				name: "mon_tempC",
				fieldLabel: _("Temperature ['C]"),
				allowDecimals: true,
				readOnly: true,
				value: 0
			},{
				xtype: "numberfield",
				name: "mon_tempF",
				fieldLabel: _("Temperature ['F]"),
				allowDecimals: true,
				readOnly: true,
				value: 0
			},{
				xtype: "numberfield",
				name: "mon_rpm",
				fieldLabel: _("Velocity [RPM]"),
				allowDecimals: true,
				readOnly: true,
				value: 0
			},{
				xtype: "numberfield",
				name: "mon_pwm",
				fieldLabel: _("Output [% PWM]"),
				allowDecimals: true,
				readOnly: true,
				value: 0
			},{
                xtype: 'textfield',
                name: 'mon_alarm',
                fieldLabel: _('Alarm'),
                readOnly: true,
                allowBlank: true,
                value: ''
            }]          
        }, {
            xtype: 'fieldset',
            title: _('Fan settings'),
            defaults: {
                labelSeparator: ''
            },
            items: [{
                xtype: 'combo',
                name: 'fan_mode',
                fieldLabel: _('Mode'),
                queryMode: 'local',
                store: [
                    [ 'ONOFF', _('ONOFF') ],
                    [ 'PWM', _('PWM') ],
                    [ 'RPM', _('RPM') ]
                ],
                editable: false,
                readOnly: false,
                value: 'RPM'
            },{
				xtype: "numberfield",
				name: "fan_ONOFFgpio",
				fieldLabel: _("ONOFF gpio"),
				minValue: 0,
				maxValue: 27,
				allowDecimals: false,
				allowBlank: false,
				readOnly: true,
				value: 27
			},{
                xtype: 'checkbox',
                name: 'fan_ONOFFinvert',
                fieldLabel: _('ONOFF invert'),
                readOnly: true,
                checked: false
            },{
				xtype: "numberfield",
				name: "fan_PWMcalibrated",
				fieldLabel: _("PWM calibrated [%]"),
				minValue: 0,
				maxValue: 100,
				allowDecimals: true,
				allowBlank: false,
				readOnly: true,
				value: 30
			},{
				xtype: "numberfield",
				name: "fan_PWMgpio",
				fieldLabel: _("PWM gpio"),
				minValue: 0,
				maxValue: 27,
				allowDecimals: false,
				allowBlank: false,
				readOnly: true,
				value: 18
			},{
				xtype: "numberfield",
				name: "fan_PWMfrequency",
				fieldLabel: _("PWM frequency [Hz]"),
				minValue: 0,
				maxValue: 30000,
				allowDecimals: false,
				allowBlank: false,
				readOnly: true,
				value: 10000
			},{
                xtype: 'checkbox',
                name: 'fan_PWMinvert',
                fieldLabel: _('PWM invert'),
                readOnly: true,
                checked: false
            },{
				xtype: "numberfield",
				name: "fan_recalibrate",
				fieldLabel: _("Recalibrate"),
				minValue: 0,
				maxValue: 365,
				allowDecimals: false,
				allowBlank: false,
				readOnly: true,
				value: 7
			},{
				xtype: "numberfield",
				name: "fan_RPMgpio",
				fieldLabel: _("RPM gpio"),
				minValue: 0,
				maxValue: 27,
				allowDecimals: false,
				allowBlank: false,
				readOnly: true,
				value: 17
			},{
                xtype: 'checkbox',
                name: 'fan_RPMpullup',
                fieldLabel: _('RPM pullup'),
                readOnly: true,
                checked: true
            },{
				xtype: "numberfield",
				name: "fan_RPMppr",
				fieldLabel: _("RPM ppr"),
				minValue: 1,
				maxValue: 4096,
				allowDecimals: false,
				allowBlank: false,
				readOnly: true,
				value: 2
			},{
                xtype: 'checkbox',
                name: 'fan_RPMedge',
                fieldLabel: _('RPM edge'),
                readOnly: true,
                checked: true
            },{
				xtype: "numberfield",
				name: "fan_RPMfiltersize",
				fieldLabel: _("RPM filter size"),
				minValue: 0,
				maxValue: 255,
				allowDecimals: false,
				allowBlank: false,
				readOnly: true,
				value: 0
			},{
				xtype: "numberfield",
				name: "fan_Frequency",
				fieldLabel: _("Frequency [Hz]"),
				minValue: 0,
				maxValue: 100,
				allowDecimals: false,
				allowBlank: false,
				readOnly: true,
				value: 10
			},{
				xtype: "numberfield",
				name: "fan_Pgain",
				fieldLabel: _("P gain"),
				minValue: 0,
				maxValue: 10000,
				allowDecimals: true,
				allowBlank: false,
				readOnly: true,
				value: 0.1
			},{
				xtype: "numberfield",
				name: "fan_Igain",
				fieldLabel: _("I gain"),
				minValue: 0,
				maxValue: 10000,
				allowDecimals: true,
				allowBlank: false,
				readOnly: true,
				value: 0.2
			}]            
        }, {
            xtype: 'fieldset',
            title: _('Temperature settings'),
            defaults: {
                labelSeparator: ''
            },
            items: [{
                xtype: 'checkbox',
                name: 'temp_cpu',
                fieldLabel: _('CPU'),
                readOnly: true,
                checked: true
            },{
                xtype: 'textfield',
                name: 'temp_hdd',
                fieldLabel: _('HDD'),
                readOnly: true,
                allowBlank: true,
                value: ''
            },{
                xtype: 'textfield',
                name: 'temp_ext',
                fieldLabel: _('External'),
                readOnly: true,
                allowBlank: true,
                value: ''
            },{
                xtype: 'combo',
                name: 'temp_mode',
                fieldLabel: _('Mode'),
                queryMode: 'local',
                store: [
                    [ 'MIN', _('Minimum') ],
                    [ 'AVG', _('Average') ],
                    [ 'MAX', _('Maximum') ]
                ],
                editable: false,
                readOnly: true,
                value: 'MAX'
            },{
                xtype: 'checkbox',
                name: 'temp_Farenheit',
                fieldLabel: _('Farenheit'),
                readOnly: true,
                checked: false
            },{
				xtype: "numberfield",
				name: "temp_AlarmHigh",
				fieldLabel: _("High temperature alarm ['C]"),
				minValue: 0,
				maxValue: 150,
				allowDecimals: true,
				allowBlank: false,
				readOnly: true,
				value: 65
			},{
				xtype: "numberfield",
				name: "temp_AlarmCrit",
				fieldLabel: _("Critical temperature alarm ['C]"),
				minValue: 0,
				maxValue: 150,
				allowDecimals: true,
				allowBlank: false,
				readOnly: true,
				value: 80
			},{
                xtype: 'textfield',
                name: 'temp_AlarmShutdown',
                fieldLabel: _('Shutdown on alarm'),
                readOnly: true,
                allowBlank: true,
                value: ''
            }]    
        }, {
            xtype: 'fieldset',
            title: _('Control settings'),
            defaults: {
                labelSeparator: ''
            },
            items: [{
                xtype: 'combo',
                name: 'control_mode',
                fieldLabel: _('Mode'),
                queryMode: 'local',
                store: [
                    [ 'ONOFF', _('ONOFF') ],
                    [ 'LINEAR', _('LINEAR') ],
                    [ 'PI', _('PI') ]
                ],
                editable: false,
                readOnly: true,
                value: 'LINEAR'
            },{
				xtype: "numberfield",
				name: "control_TempOn",
				fieldLabel: _("On temperature ['C]"),
				minValue: 0,
				maxValue: 150,
				allowDecimals: true,
				allowBlank: false,
				readOnly: true,
				value: 55
			},{
				xtype: "numberfield",
				name: "control_TempHyst",
				fieldLabel: _("Hysteresis temperature ['C]"),
				minValue: 0,
				maxValue: 150,
				allowDecimals: true,
				allowBlank: false,
				readOnly: true,
				value: 5
			},{
				xtype: "numberfield",
				name: "control_FanStart",
				fieldLabel: _("Start fan PWM [%]"),
				minValue: 0,
				maxValue: 100,
				allowDecimals: true,
				allowBlank: false,
				readOnly: true,
				value: 20
			},{
				xtype: "numberfield",
				name: "control_TempStart",
				fieldLabel: _("Start temperature ['C]"),
				minValue: 0,
				maxValue: 150,
				allowDecimals: true,
				allowBlank: false,
				readOnly: true,
				value: 45
			},{
				xtype: "numberfield",
				name: "control_TempFull",
				fieldLabel: _("Full temperature ['C]"),
				minValue: 0,
				maxValue: 150,
				allowDecimals: true,
				allowBlank: false,
				readOnly: true,
				value: 65
			},{
				xtype: "numberfield",
				name: "control_LinSteps",
				fieldLabel: _("Linear steps"),
				minValue: 0,
				maxValue: 150,
				allowDecimals: true,
				allowBlank: false,
				readOnly: true,
				value: 2.5
			},{
				xtype: "numberfield",
				name: "control_Frequency",
				fieldLabel: _("Frequency [Hz]"),
				minValue: 0,
				maxValue: 100,
				allowDecimals: false,
				allowBlank: false,
				readOnly: true,
				value: 1
			},{
				xtype: "numberfield",
				name: "control_Pgain",
				fieldLabel: _("P gain"),
				minValue: 0,
				maxValue: 10000,
				allowDecimals: true,
				allowBlank: false,
				readOnly: true,
				value: 10
			},{
				xtype: "numberfield",
				name: "control_Igain",
				fieldLabel: _("I gain"),
				minValue: 0,
				maxValue: 10000,
				allowDecimals: true,
				allowBlank: false,
				readOnly: true,
				value: 0.1
			}]            
        }
    ];
    },
    
    getButtonItems: function() {
        var items = this.callParent(arguments);

        Ext.Array.push(items, [{
            id: this.getId() + '-manual',
            xtype: 'button',
            text: _('Manual tuning'),
            iconCls: 'x-fa fa-pencil',
            handler: Ext.Function.bind(this.onManualButton, this),
            scope: this,
            disabled: false
        },
        {
            id: this.getId() + '-update',
            xtype: 'button',
            text: _('Update manual'),
            iconCls: 'x-fa fa-download',
            handler: Ext.Function.bind(this.onUpdateButton, this),
            scope: this,
            disabled: true
        },
        {
            id: this.getId() + '-refresh',
            xtype: 'button',
            text: _('Refresh'),
            iconCls: 'x-fa fa-refresh',
            handler: Ext.Function.bind(this.onRefreshButton, this),
            scope: this,
            disabled: false
        }]);

        return items;
    },
    
    initComponent: function() {
		var me = this;
		me.callParent(arguments);
		me.on("load", function(c, values) {
			this.setButtonDisabled("manual", values.manual);
            this.setButtonDisabled("update", !values.manual || values.enable);
		}, me);
	},

    onManualButton: function() {
		var me = this;
        this.setButtonDisabled("manual", true);
		// Execute RPC.
		OMV.Rpc.request({
			scope: me,
			callback: function(id, success, response) {
				this.doReload();
			},
			relayErrors: false,
			rpcData: {
				service: "SmartFanControl",
				method: "manual"
			}
		});
	},
    
    onUpdateButton: function() {
		var me = this;
        this.setButtonDisabled("update", true);
		// Execute RPC.
		OMV.Rpc.request({
			scope: me,
			callback: function(id, success, response) {
				this.doReload();
			},
			relayErrors: false,
			rpcData: {
				service: "SmartFanControl",
				method: "update"
			}
		});
	},
    
    onRefreshButton: function() {
        this.doLoad();
	}

});

OMV.WorkspaceManager.registerPanel({
    id: 'smartfancontrol_settings',
    path: '/service/smartfancontrol',
    text: _('Settings'),
    position: 10,
    className: 'OMV.module.admin.service.smartfancontrol.settings'
});
