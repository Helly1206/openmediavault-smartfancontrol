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

// require("js/omv/module/admin/diagnostic/log/plugin/Plugin.js")

Ext.define('OMV.module.admin.diagnostic.log.plugin.SmartFanControl', {
    extend: 'OMV.module.admin.diagnostic.log.plugin.Plugin',
    alias: 'omv.plugin.diagnostic.log.smartfancontrol',

    id: 'smartfancontrol',
    text: 'SmartFanControl',
    columns: [{
        text: _('Date & Time'),
        sortable: true,
        dataIndex: 'rownum',
        stateId: 'date',
        renderer: function(value, metaData, record) {
            return record.get('date');
        }
    }, {
        text: _('Level'),
        sortable: true,
        dataIndex: 'level',
        stateId: 'level',
        flex: 1
    }, {
        text: _('Event'),
        sortable: true,
        dataIndex: 'event',
        stateId: 'event',
        flex: 1
    }],
    rpcParams: {
        id: 'smartfancontrol'
    },
    rpcFields: [{
        name: 'rownum',
        type: 'int'
    }, {
        name: 'ts',
        type: 'int'
    }, {
        name: 'date',
        type: 'string'
    }, {
        name: 'level',
        type: 'string'
    }, {
        name: 'event',
        type: 'string'
    }]
});
