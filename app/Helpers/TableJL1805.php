<?php
namespace App\Helpers;

use Illuminate\Support\Facades\DB;

class TableJL1805
{
	protected $query = null;
	protected $config = [
	  		'rows_current'=>10,
			'search_value'=>'',
			'column'=>null,//columna por la cual se está ordenando
			'direction'=>null,//direccion de ordenamiento//desc, asc
			'headers'=>[//datos de prueba
				'first_name',
				'last_name',
				'age',
				'date'
			],
            'having' => [
                'age'=>true
            ]
	];

    public function __construct($query, $config)
    {
        $this->query = $query;
        $this->config = array_merge($this->config, $config);
    }

    public function make(){
    	$this->query = $this->query->where(function($q)
    	{
    		$search = '%'.$this->config['search_value'].'%';
    		$headers = $this->config['headers'];
            $name_columns = array_key_exists('name_columns', $this->config)?$this->config['name_columns']:[];

            if(array_key_exists($headers[0], $name_columns)){
                if(is_array($name_columns[$headers[0]])){
                    $concat = 'CONCAT(';
                    for($i = 0;$i < count($name_columns[$headers[0]]);$i++)
                        $concat .= $name_columns[$headers[0]][$i].'," ",';

                    $concat = trim($concat, '," ",').')';
                    $q->where(DB::raw($concat),'like', $search);
                }else{
                    $q->where($name_columns[$headers[0]],'like', $search);
                }
            }else{
                $q->where($headers[0],'like', $search);
            }

			for ($i = 1; $i < count($headers); $i++) {
                if(array_key_exists($headers[$i], $name_columns)){
                    if(is_array($name_columns[$headers[$i]])){
                        $concat = 'CONCAT(';
                        for($i_ = 0;$i_ < count($name_columns[$headers[$i]]);$i_++)
                            $concat .= $name_columns[$headers[$i]][$i_].'," ",';

                        $concat = trim($concat, '," ",').')';
                        $q->orWhere(DB::raw($concat),'like', $search);
                    }else{
                        $q->orWhere($name_columns[$headers[$i]],'like', $search);
                    }
                }else{
                    $q->orWhere($headers[$i],'like', $search);
                }
			}
    	});


    	if($this->config['direction'] && $this->config['column']){
    		$this->query = $this->query->orderBy($this->config['column'], $this->config['direction']);
    	}

    	return $this->query->paginate($this->config['rows_current']);
    }
}
