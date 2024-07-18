<?php

namespace App\Exports;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithDrawings;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;

class DataExport implements FromCollection, WithHeadings, WithColumnWidths, WithStyles, WithDrawings, WithCustomStartCell
{	
	public $data = [];
	public function __construct($data){
		$this->data = $data;
	}

    /**
    * @return \Illuminate\Support\Collection
    */

    public function addTextToCell(Worksheet $sheet, $text, $cell)
    {
        $sheet->setCellValue($cell, $text);
    }

    public function startCell(): string
    {
        return 'A7';
    }
    public function drawings()
    {
        $drawing = new Drawing();
        $drawing->setName('Logo');
        $drawing->setDescription('This is my logo');
        $drawing->setPath(public_path('/images/logo_sm.png'));
        $drawing->setHeight(90);
        $drawing->setCoordinates('B2');

        return $drawing;
    }

    public function styles(Worksheet $sheet)
    {
        $this->addTextToCell($sheet, 'doble clik para visitar nuestra web', 'C2');
        $homeUrl = URL::to('/');
        $this->addTextToCell($sheet, $homeUrl, 'C3');

        return [
            7    => ['font' => ['bold' => true]]     
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 5,
            'B' => 35,  
            'C' => 40,  
            'D' => 40,  
            'E' => 12,  
            'F' => 17,  
            'G' => 20, 
            'H' => 20,  
            'I' => 20,  
            'J' => 57,  
            'K' => 57, 
            'L' => 57,           
        ];
    }


    public function headings():array
    {
        return[
            "ID",
            "TITULO",
            "DESCRIPCIÓN CORTA",
            "DESCRIPCIÓN DETALLADA",
            "FECHA",
            "TIPO",
            "CATEGORIA",
            "MUNICIPIO",
            "DEPARTAMENTO",                       
            "VIDEO     (doble click en link para ver)",
            "IMAGEN    (doble click en link para ver)",
            "AUDIO     (doble click en link para escuchar)"
        ];
    }

    
    public function collection()
    {
        return $this->data;
    }
}
