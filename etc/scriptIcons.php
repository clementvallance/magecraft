<?php
declare(strict_types=1);

if (isset($argv[1])) {
    $lessPath = $argv[1];
} else {
    $lessPath = "/[vendor]/[theme]"; // default argument if not specified
    echo "\e[1;37;43m" . "No argument specified. Default used: " . $lessPath . "\e[0m\n";
}
if (isset($argv[2])) {
    $generatedFilename = $argv[2];
} else {
    $generatedFilename = "load_widget.xml"; // default generated filename if not specified
    echo "\e[1;37;43m" . "No second argument specified. Default used: " . $generatedFilename . "\e[0m\n";
}
$xmlFile = new DOMDocument();
$xmlFile->preserveWhiteSpace = false;
$xmlFile->formatOutput = true;                          //reformat code (needs to be set before ->load())
$xmlFile->load('widget.xml');
$root = $xmlFile->documentElement;

$options = $root->getElementsByTagName('option'); // search for all elements with tag name "option"
$nodesToDelete = [];                               // array of nodes to delete
foreach ($options as $option) {                         // add every existing option nodes to the array
    $nodesToDelete[] = $option;
}
foreach ($nodesToDelete as $node) {                      //delete each nodes from the array
    $node->parentNode->removeChild($node);
}
// here we get an XML files without all the previous option nodes (the previous list of icons has been deleted)

$filename = '../../../../../' . 'app/design/frontend' . $lessPath . '/web/css/source/_icons_variables.less'; // path to the _icons_variables.less file
if (!file_exists($filename)) {
    echo "\e[1;37;41m" . "_icons_variables.less File not found with argument " . $lessPath . "\e[0m\n";
    $file = file($filename);
    exit;
}
$file = file($filename); // open file


$total = \count($file); // return number of lines
for ($i = 3; $i < $total; $i++) { //start from line 4
    $value = get_string_between($file[$i], '@', ':'); // find string between "@" and ":" to find the value attribut of the XML nodes
    $pos = strpos($value, '_'); // find the "-" position for substring
    $name = substr($value, $pos + 1); // substring to get the name attribut of the XML option nodes
    $pos = strpos($name, '_');
    $label = substr($name, $pos + 1);  // substring to get the label text
    $label = str_replace('_', ' ', $label);
    //---------------------------------------
    //Here we get all the informations to create the option node (value, name, label)

    $options = $xmlFile->getElementsByTagName('options')[0]; // select the "options" node from the XML files to add "option" nodes inside
    $node = $xmlFile->createElement('option');               // create an option node
    $node->setAttribute('name', $name);                       // set name attribut  to the node
    $node->setAttribute('value', $value);                     // set value attribut to the node
    if ($i === 3) {                                                    // set selected attribut to true to the first option node (else set it to false)
        $node->setAttribute('selected', 'true');
    } else {
        $node->setAttribute('selected', 'false');
    }

    $nodelabel = $xmlFile->createElement('label', $label); // create a label node
    $node->appendChild($nodelabel);                              //add label node as a child to the option node
    $options->appendChild($node);                                // add option node as a child of the options node
}
$widgetFilename = $generatedFilename;
$xmlFile->save($widgetFilename);
print $widgetFilename . ' saved in Dir: ' . getcwd() . "\n";    // print the current directory path// save the file in the actual directory / to do :replace load_widget.xml with widget.xml
echo "\e[1;37;42m" . "Done!" . "\e[0m\n";

/**
 * Extract a string between two others
 * @param string $string , string $start, string $end
 * @return string
 */
function get_string_between(string $string, string $start, string $end): string
{
    $string = ' ' . $string;
    $ini = strpos($string, $start);
    if ($ini === 0) {
        return '';
    }
    $ini += \strlen($start);
    $len = strpos($string, $end, $ini) - $ini;
    return substr($string, $ini, $len);
}
