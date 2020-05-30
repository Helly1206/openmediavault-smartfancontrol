<?php

/**
 * Copyright (C) 2014-2019 OpenMediaVault Plugin Developers.
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

/*

On create: 
- Do not enable if doesn't exist
- update xml to settings -d
- reset manual bit (-d)

On enable: update settings to xml and then enable

On disable: just disable

On manual button:
- set manual bit
- disable
- update settings to xml (manual bit)

On update button:
- set enable
- update xml to settings (manual bit) -d
- reset manual bit (-d)

*/

namespace OMV\Engined\Rpc;

use OMV\Config\ConfigObject;
use OMV\Config\Database;
use OMV\Config\DatabaseException;
use OMV\Rpc\ServiceAbstract;
use OMV\System\Process;
use PharData;

class SmartFanControl extends ServiceAbstract
{
    /** @var Database */
    private $database;

    /** @var string */
    private $dataModelPath = 'conf.service.smartfancontrol';

    public function __construct(Database $database = null)
    {
        $this->database = $database ?: Database::getInstance();
    }

    /**
     * Get the RPC service name.
     *
     * @return void
     */
    public function getName()
    {
        return 'SmartFanControl';
    }

    /**
     * Initialize the RPC service.
     *
     * @return void
     */
    public function initialize()
    {
        $this->registerMethod('getSettings');
        $this->registerMethod('setSettings');
        $this->registerMethod('manual');
        $this->registerMethod('update');
        $this->registerMethod('getStats');
    }

    /**
     * Get the general settings.
     *
     * @param array $params
     * @param array $context
     *
     * @return array
     */
    public function getSettings($params, $context)
    {
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);

        $object = $this->database->get($this->dataModelPath);

        $dbarr = $object->getAssoc();
        $arr = array( );
        
        foreach ($dbarr as $key => $value) {
            if (is_array($value)) {
                foreach ($value as $key2 => $value2) {
                    $arr[$key."_".$key2] = $value2;    
                }
            } else {
                $arr[$key] = $value;
            }
        }
        
        // Add monitoring values
        if (!$object->get('enable')) {
            $arr["mon_tempC"] = 0;
            $arr["mon_tempF"] = 0;
            $arr["mon_rpm"] = 0;
            $arr["mon_pwm"] = 0;
            $arr["mon_alarm"] = gettext('SmartFanControl is disabled.');
        } else {
            $data = $this->GetMonitor();
            $arr["mon_tempC"] = $data['temp'];
            $arr["mon_tempF"] = $data['temp'];
            $arr["mon_rpm"] = $data['vel'];
            $arr["mon_pwm"] = $data['out'];
            $arr["mon_alarm"] = $data['alarm'];
        }
        
        return $arr;
    }

    /**
     * Set the general settings.
     *
     * @param array $params
     * @param array $context
     *
     * @return array
     */
    public function setSettings($params, $context)
    {
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        $this->validateMethodParams($params, 'rpc.smartfancontrol.setsettings');

        $object = $this->database->get($this->dataModelPath);
        
        foreach ($params as $key => $value) {
            if (strpos($key, "mon_") === false) { // if $key startswith "mon_" then don't copy, else:
                $object->set(str_replace("_", ".", $key), $value);
            }
        }

        $this->database->set($object);

        return $object->getAssoc();
    }

    /**
     * Manually update job configuration outside OMV.
     *
     * @param array $params
     * @param array $context
     *
     * @return void
     */
    public function manual($params, $context)
    {
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);

        $object = $this->database->get($this->dataModelPath);

        $object->set('enable', FALSE);
        $object->set('manual', TRUE);
        
        $this->database->set($object);

        return $object->getAssoc();
    }

     /**
     * Update job configuration after manual update outside OMV.
     *
     * @param array $params
     * @param array $context
     *
     * @return void
     */
    public function update($params, $context)
    {
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);

        $object = $this->database->get($this->dataModelPath);

        $object->set('enable', TRUE);
        //$object->set('manual', FALSE); // manual will be disabled after settings copied in db
        
        $this->database->set($object);

        return $object->getAssoc();
    }
    
    /**
     * Get general SmartFanControl stats.
     *
     * @param array $params
     * @param array $context
     *
     * @return string
     */
    public function getStats($params, $context)
    {
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);

        $object = $this->database->get($this->dataModelPath);

        if (!$object->get('enable')) {
            return gettext('SmartFanControl is disabled.');
        }
        
        $data = $this->GetMonitor();
        
        if ($object->get('temp.Farenheit')) {
            $unit = gettext(" 'F");
        } else {
            $unit = gettext(" 'C");
        }
        $retstring = gettext("Temperature: ").$data['temp'].$unit."\n".gettext("Velocity: ").$data['vel'].gettext(" RPM")."\n".gettext("Output: ").$data['out'].gettext("% PWM")."\n".gettext("Alarm: ").$data['alarm'];
        

        return $retstring;
    }
    
    /**
     * This function obtains data from monitor
     *
     * @param object (remotemount object)
     *
     * @return array containing values as string
     */
    private function GetMonitor()
    {
        $runFile = '/run/smartfancontrol';
        
        $data = [];
        try {
            $runData = file_get_contents($runFile);
            list($data['temp'], $data['vel'], $data['out'], $data['alarm']) = explode(",", $runData);
        } catch (Exception $e) {
            $data['temp'] = "0";
            $data['vel'] = "0";
            $data['out'] = "0";
            $data['alarm'] = "Monitor error";
        }

        return $data;
    }
    
}
