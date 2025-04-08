import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';

Chart.register(...registerables);

interface DemandaSummary {
  total: number;
  concluidas: number;
  emAndamento: number;
  pendentes: number;
}

interface KPIs {
  tempoMedioResolucao: number;
  percentualConcluidas: string;
  demandasPorDia: number;
  slaAtendidos: number;
  taxaReabertura: number;
}

interface Alerta {
  tipo: string;
  quantidade: number;
  severidade: 'alta' | 'media' | 'baixa';
}

interface DepartmentData {
  name: string;
  value: number;
}

interface PriorityData {
  name: string;
  value: number;
}

interface TimeSeriesData {
  name: string;
  concluidas: number;
  emAndamento: number;
  pendentes: number;
}

interface Funcionario {
  id: number;
  nome: string;
  departamento: string;
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    MatProgressBarModule,
    MatDividerModule,
    MatBadgeModule
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  demandaSummary: DemandaSummary = {
    total: 0,
    concluidas: 0,
    emAndamento: 0,
    pendentes: 0
  };

  kpis: KPIs = {
    tempoMedioResolucao: 0,
    percentualConcluidas: '0',
    demandasPorDia: 0,
    slaAtendidos: 0,
    taxaReabertura: 0
  };

  alertas: Alerta[] = [];
  departmentData: DepartmentData[] = [];
  priorityData: PriorityData[] = [];
  timeSeriesData: TimeSeriesData[] = [];

  filtroSelecionado: string = 'todos';
  zonaSelecionada: string = 'todas';
  bairroSelecionado: string = 'todos';
  funcionarioSelecionado: string = 'todos';
  periodoSelecionado: string = 'mes';

  bairrosUrbanos: string[] = [
    'Emília Costa',
    'Polivalente',
    'Centro',
    'Beira Rio',
    '2 de julho',
    'Renovação',
    'Teotônio Calheira',
    'Eliseu Leal',
    'Leonel',
    'Jardim Gandu'
  ];

  bairrosRurais: string[] = [
    'Monte alegre',
    'Baixa alegre',
    'Brongo',
    'Água preta',
    'Taararanga',
    'Paó',
    'Jericó'
  ];

  bairrosDisponiveis: string[] = [];

  funcionarios: Funcionario[] = [
    { id: 1, nome: 'João Silva', departamento: 'Obras' },
    { id: 2, nome: 'Maria Oliveira', departamento: 'Saúde' },
    { id: 3, nome: 'Pedro Santos', departamento: 'Educação' },
    { id: 4, nome: 'Ana Souza', departamento: 'Segurança' },
    { id: 5, nome: 'Carlos Pereira', departamento: 'Administração' },
    { id: 6, nome: 'Juliana Lima', departamento: 'Meio Ambiente' }
  ];

  chartColors = {
    concluidas: 'rgba(76, 175, 80, 0.7)',
    emAndamento: 'rgba(255, 205, 86, 0.7)',
    pendentes: 'rgba(255, 99, 132, 0.7)',
    borderConcluidas: 'rgba(76, 175, 80, 1)',
    borderEmAndamento: 'rgba(255, 205, 86, 1)',
    borderPendentes: 'rgba(255, 99, 132, 1)'
  };

  chartInstances: { [key: string]: Chart } = {};

  constructor() { }

  ngOnInit(): void {
    this.carregarDadosMock();

    this.bairrosDisponiveis = [...this.bairrosUrbanos, ...this.bairrosRurais].sort();

    setTimeout(() => {
      this.renderizarGraficoPizza();
      this.renderizarGraficoBarras();
      this.renderizarGraficoLinha();
      this.renderizarGraficoDepartamentos();
      this.renderizarGraficoPrioridades();
    }, 0);
  }

  carregarDadosMock(): void {
    this.demandaSummary = {
      total: 120,
      concluidas: 25,
      emAndamento: 55,
      pendentes: 40
    };

    this.kpis = {
      tempoMedioResolucao: 3.2,
      percentualConcluidas: ((this.demandaSummary.concluidas / this.demandaSummary.total) * 100).toFixed(1),
      demandasPorDia: 8.5,
      slaAtendidos: 87,
      taxaReabertura: 12
    };

    this.alertas = [
      { tipo: 'Atraso', quantidade: 12, severidade: 'alta' },
      { tipo: 'Ociosidade', quantidade: 8, severidade: 'media' },
      { tipo: 'Não Conformidade', quantidade: 5, severidade: 'baixa' }
    ];

    this.departmentData = [
      { name: 'Obras', value: 45 },
      { name: 'Saúde', value: 28 },
      { name: 'Educação', value: 32 },
      { name: 'Segurança', value: 20 },
      { name: 'Administração', value: 18 },
      { name: 'Meio Ambiente', value: 15 }
    ];


    this.priorityData = [
      { name: 'Alta', value: 38 },
      { name: 'Média', value: 52 },
      { name: 'Baixa', value: 30 }
    ];

    this.timeSeriesData = [
      { name: 'Jan', concluidas: 20, emAndamento: 45, pendentes: 35 },
      { name: 'Fev', concluidas: 25, emAndamento: 55, pendentes: 40 },
      { name: 'Mar', concluidas: 30, emAndamento: 50, pendentes: 38 },
      { name: 'Abr', concluidas: 40, emAndamento: 45, pendentes: 32 },
      { name: 'Mai', concluidas: 35, emAndamento: 40, pendentes: 30 },
      { name: 'Jun', concluidas: 45, emAndamento: 35, pendentes: 25 }
    ];
  }

  renderizarGraficoPizza(): void {
    const ctx = document.getElementById('graficoPizza') as HTMLCanvasElement;
    if (!ctx) return;

    this.chartInstances['pizza'] = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Concluídas', 'Em Andamento', 'Pendentes'],
        datasets: [{
          data: [
            this.demandaSummary.concluidas,
            this.demandaSummary.emAndamento,
            this.demandaSummary.pendentes
          ],
          backgroundColor: [
            this.chartColors.concluidas,
            this.chartColors.emAndamento,
            this.chartColors.pendentes
          ],
          borderColor: [
            this.chartColors.borderConcluidas,
            this.chartColors.borderEmAndamento,
            this.chartColors.borderPendentes
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Distribuição de Demandas por Status'
          }
        }
      }
    });
  }

  renderizarGraficoBarras(): void {
    const ctx = document.getElementById('graficoBarras') as HTMLCanvasElement;
    if (!ctx) return;

    this.chartInstances['barras'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Concluídas', 'Em Andamento', 'Pendentes'],
        datasets: [{
          label: 'Quantidade de Demandas',
          data: [
            this.demandaSummary.concluidas,
            this.demandaSummary.emAndamento,
            this.demandaSummary.pendentes
          ],
          backgroundColor: [
            this.chartColors.concluidas,
            this.chartColors.emAndamento,
            this.chartColors.pendentes
          ],
          borderColor: [
            this.chartColors.borderConcluidas,
            this.chartColors.borderEmAndamento,
            this.chartColors.borderPendentes
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Demandas por Status'
          }
        }
      }
    });
  }

  renderizarGraficoLinha(): void {
    const ctx = document.getElementById('graficoLinha') as HTMLCanvasElement;
    if (!ctx) return;

    this.chartInstances['linha'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.timeSeriesData.map(item => item.name),
        datasets: [
          {
            label: 'Concluídas',
            data: this.timeSeriesData.map(item => item.concluidas),
            borderColor: this.chartColors.borderConcluidas,
            backgroundColor: this.chartColors.concluidas,
            tension: 0.4,
            fill: false
          },
          {
            label: 'Em Andamento',
            data: this.timeSeriesData.map(item => item.emAndamento),
            borderColor: this.chartColors.borderEmAndamento,
            backgroundColor: this.chartColors.emAndamento,
            tension: 0.4,
            fill: false
          },
          {
            label: 'Pendentes',
            data: this.timeSeriesData.map(item => item.pendentes),
            borderColor: this.chartColors.borderPendentes,
            backgroundColor: this.chartColors.pendentes,
            tension: 0.4,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Quantidade'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Mês'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Evolução de Demandas ao Longo do Tempo'
          }
        }
      }
    });
  }

  renderizarGraficoDepartamentos(): void {
    const ctx = document.getElementById('graficoDepartamentos') as HTMLCanvasElement;
    if (!ctx) return;

    this.chartInstances['departamentos'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.departmentData.map(item => item.name),
        datasets: [{
          data: this.departmentData.map(item => item.value),
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(75, 192, 192, 0.7)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Demandas por Departamento'
          }
        }
      }
    });
  }

  renderizarGraficoPrioridades(): void {
    const ctx = document.getElementById('graficoPrioridades') as HTMLCanvasElement;
    if (!ctx) return;

    this.chartInstances['prioridades'] = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: this.priorityData.map(item => item.name),
        datasets: [{
          data: this.priorityData.map(item => item.value),
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 205, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Demandas por Prioridade'
          }
        }
      }
    });
  }

  onZonaChange(): void {
    if (this.zonaSelecionada === 'urbana') {
      this.bairrosDisponiveis = [...this.bairrosUrbanos];
    } else if (this.zonaSelecionada === 'rural') {
      this.bairrosDisponiveis = [...this.bairrosRurais];
    } else {
      this.bairrosDisponiveis = [...this.bairrosUrbanos, ...this.bairrosRurais].sort();
    }

    this.bairroSelecionado = 'todos';

    this.onFilterChange();
  }

  onFilterChange(): void {
    this.atualizarDadosFiltrados();
  }

  onPeriodChange(): void {
    // Atualizar dados com base no período selecionado
    this.atualizarDadosFiltrados();
  }

  atualizarDadosFiltrados(): void {
    this.simularFiltragem();
    this.atualizarGraficos();
  }

  simularFiltragem(): void {
    let fatorMultiplicador = 1.0;

    if (this.filtroSelecionado !== 'todos') {
      fatorMultiplicador *= 0.7;
    }

    if (this.zonaSelecionada === 'urbana') {
      fatorMultiplicador *= 0.85;
    } else if (this.zonaSelecionada === 'rural') {
      fatorMultiplicador *= 0.65;
    }

    if (this.bairroSelecionado !== 'todos') {
      fatorMultiplicador *= 0.5;
    }

    if (this.funcionarioSelecionado !== 'todos') {
      fatorMultiplicador *= 0.4;
    }

    if (this.periodoSelecionado === 'semana') {
      fatorMultiplicador *= 0.3;
    } else if (this.periodoSelecionado === 'mes') {
      fatorMultiplicador *= 0.7;
    } else if (this.periodoSelecionado === 'trimestre') {
      fatorMultiplicador *= 0.85;
    }

    const total = Math.round(120 * fatorMultiplicador);
    const concluidas = Math.round(25 * fatorMultiplicador);
    const emAndamento = Math.round(55 * fatorMultiplicador);
    const pendentes = Math.round(40 * fatorMultiplicador);

    this.demandaSummary = {
      total,
      concluidas,
      emAndamento,
      pendentes
    };

    this.kpis = {
      tempoMedioResolucao: parseFloat((3.2 * (0.8 + Math.random() * 0.4)).toFixed(1)),
      percentualConcluidas: ((concluidas / total) * 100).toFixed(1),
      demandasPorDia: parseFloat((8.5 * fatorMultiplicador).toFixed(1)),
      slaAtendidos: Math.round(87 * (0.8 + Math.random() * 0.4)),
      taxaReabertura: Math.round(12 * (0.8 + Math.random() * 0.4))
    };

    this.departmentData = [
      { name: 'Obras', value: 45 },
      { name: 'Saúde', value: 28 },
      { name: 'Educação', value: 32 },
      { name: 'Segurança', value: 20 },
      { name: 'Administração', value: 18 },
      { name: 'Meio Ambiente', value: 15 }
    ];


    this.priorityData = [
      { name: 'Alta', value: Math.round(38 * fatorMultiplicador) },
      { name: 'Média', value: Math.round(52 * fatorMultiplicador) },
      { name: 'Baixa', value: Math.round(30 * fatorMultiplicador) }
    ];

    this.timeSeriesData = this.timeSeriesData.map(item => {
      return {
        name: item.name,
        concluidas: Math.round(item.concluidas * fatorMultiplicador),
        emAndamento: Math.round(item.emAndamento * fatorMultiplicador),
        pendentes: Math.round(item.pendentes * fatorMultiplicador)
      };
    });

    this.alertas = [
      { tipo: 'Atraso', quantidade: Math.round(12 * fatorMultiplicador), severidade: 'alta' },
      { tipo: 'Ociosidade', quantidade: Math.round(8 * fatorMultiplicador), severidade: 'media' },
      { tipo: 'Não Conformidade', quantidade: Math.round(5 * fatorMultiplicador), severidade: 'baixa' }
    ];
  }

  atualizarGraficos(): void {
    if (this.chartInstances['pizza']) {
      this.chartInstances['pizza'].data.datasets[0].data = [
        this.demandaSummary.concluidas,
        this.demandaSummary.emAndamento,
        this.demandaSummary.pendentes
      ];
      this.chartInstances['pizza'].update();
    }

    if (this.chartInstances['barras']) {
      this.chartInstances['barras'].data.datasets[0].data = [
        this.demandaSummary.concluidas,
        this.demandaSummary.emAndamento,
        this.demandaSummary.pendentes
      ];
      this.chartInstances['barras'].update();
    }

    if (this.chartInstances['departamentos']) {
      this.chartInstances['departamentos'].data.labels = this.departmentData.map(item => item.name);
      this.chartInstances['departamentos'].data.datasets[0].data = this.departmentData.map(item => item.value);
      this.chartInstances['departamentos'].update();
    }

    if (this.chartInstances['prioridades']) {
      this.chartInstances['prioridades'].data.labels = this.priorityData.map(item => item.name);
      this.chartInstances['prioridades'].data.datasets[0].data = this.priorityData.map(item => item.value);
      this.chartInstances['prioridades'].update();
    }

    if (this.chartInstances['linha']) {
      this.chartInstances['linha'].data.labels = this.timeSeriesData.map(item => item.name);
      this.chartInstances['linha'].data.datasets[0].data = this.timeSeriesData.map(item => item.concluidas);
      this.chartInstances['linha'].data.datasets[1].data = this.timeSeriesData.map(item => item.emAndamento);
      this.chartInstances['linha'].data.datasets[2].data = this.timeSeriesData.map(item => item.pendentes);
      this.chartInstances['linha'].update();
    }
  }

  getSeveridadeClass(severidade: string): string {
    switch (severidade) {
      case 'alta': return 'severidade-alta';
      case 'media': return 'severidade-media';
      case 'baixa': return 'severidade-baixa';
      default: return '';
    }
  }
}